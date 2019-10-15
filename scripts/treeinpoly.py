import csv
import json
from collections import defaultdict

from shapely.geometry import Point
from shapely.geometry import Polygon

# from https://www.opendataphilly.org/dataset/zip-codes
with open('Zipcodes_Poly.geojson') as f:
    zip_geojson = f.read()

shapes = {}
for feature in zip_geojson['features']:
    points = []
    for point in feature['geometry']['coordinates'][0]:
        points.append((point[1], point[0]))
    shape = Polygon(points)
    shapes[feature['properties']['CODE']] = shape

counts = defaultdict(int)

# from https://www.opendataphilly.org/dataset/philadelphia-street-tree-inventory
with open('PPR_StreetTrees.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')

    for i, row in enumerate(readCSV):
        if i > 0:
            point = Point(float(row[1]), float(row[0]))
            for zip, shape in shapes.items():
                if shape.contains(point):
                    counts[zip] += 1

for feature in zip_geojson['features']:
    count = counts[feature['properties']['CODE']]
    feature['properties']['count'] = count
    feature['properties']['tree_per_area'] = count / feature['properties']['Shape__Area']

with open("zip-trees.geojson", "w") as f:
    f.write(json.dumps(zip_geojson))

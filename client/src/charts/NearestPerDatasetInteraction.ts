import { Chart, Element, Interaction, Point, VisualElement } from 'chart.js';

// Helper function shamelessly stolen from Chart.js
// https://github.com/chartjs/Chart.js
function getDistanceMetricForAxis(axis: string) {
  const useX = axis.indexOf('x') !== -1;
  const useY = axis.indexOf('y') !== -1;

  return function (pt1: Point, pt2: Point) {
    const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
    const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  };
}

// Modified version of default Chart.js nearest interaction
export function getNearestItemsPerDataset(chart: Chart, position: Point, useFinalPosition?: boolean) {
  let items = [] as any[];

  let itemsObj: { [key: number]: any } = {};
  let distancesObj: { [key: number]: number } = {};

  const distanceMetric = getDistanceMetricForAxis('x');

  function evaluationFunc(element: Element & VisualElement, datasetIndex: number, index: number) {
    const center = element.getCenterPoint(useFinalPosition);

    const distance = distanceMetric(position, center);

    if (distance < 8) {
      if (!itemsObj[datasetIndex]) {
        itemsObj[datasetIndex] = {
          element,
          datasetIndex,
          index,
        };

        distancesObj[datasetIndex] = distance;
      }

      if (distance < distancesObj[datasetIndex]) {
        distancesObj[datasetIndex] = distance;
        itemsObj[datasetIndex] = {
          element,
          datasetIndex,
          index,
        };
      }
    }
  }


  Interaction.evaluateInteractionItems(chart, 'x', position, evaluationFunc);

  items = Object.keys(itemsObj).map((key: any) => itemsObj[key]);

  return items;
}

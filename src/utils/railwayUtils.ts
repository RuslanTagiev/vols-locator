import type { CableNode } from '../types/vols';

interface AccidentResult {
  coords: [number, number];
  railwayKm: number;
  railwayPk: number;
}

export function calculateAccidentPosition(
  nodes: CableNode[],
  selectedNode: CableNode,
  direction: 'forward' | 'backward',
  reflectometerValue: number
): AccidentResult | null {
  let targetDistance = selectedNode.distanceFromStart;
  
  if (direction === 'forward') {
    targetDistance += reflectometerValue;
  } else {
    targetDistance -= reflectometerValue;
  }

  for (let i = 0; i < nodes.length - 1; i++) {
    const startNode = nodes[i];
    const endNode = nodes[i + 1];

    if (targetDistance >= startNode.distanceFromStart && targetDistance <= endNode.distanceFromStart) {
      const segmentLength = endNode.distanceFromStart - startNode.distanceFromStart;
      const distanceInSegment = targetDistance - startNode.distanceFromStart;
      const ratio = distanceInSegment / segmentLength;

      const lat = startNode.lat + (endNode.lat - startNode.lat) * ratio;
      const lng = startNode.lng + (endNode.lng - startNode.lng) * ratio;

      const startRailwayAbsMeters = startNode.railwayKm * 1000 + startNode.railwayPk * 100;
      const endRailwayAbsMeters = endNode.railwayKm * 1000 + endNode.railwayPk * 100;
      
      const targetRailwayAbsMeters = startRailwayAbsMeters + (endRailwayAbsMeters - startRailwayAbsMeters) * ratio;
      
      const railwayKm = Math.floor(targetRailwayAbsMeters / 1000);
      const railwayPk = Math.floor((targetRailwayAbsMeters % 1000) / 100);

      return { coords: [lat, lng], railwayKm, railwayPk };
    }
  }

  return null;
}

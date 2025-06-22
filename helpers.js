/**
 * Utility functions for extracting and processing TfL journey data
 */

export function extractAlerts(journeyData) {
  const alerts = [];
  
  if (journeyData.alerts) {
    alerts.push(...journeyData.alerts);
  }

  // Check for alerts in journey legs
  if (journeyData.journeys) {
    journeyData.journeys.forEach(journey => {
      if (journey.legs) {
        journey.legs.forEach(leg => {
          if (leg.alerts) {
            alerts.push(...leg.alerts);
          }
        });
      }
    });
  }

  return alerts;
}

export function extractStopPoints(journeyData) {
  const stopPoints = [];
  
  if (journeyData.stopPoints) {
    stopPoints.push(...journeyData.stopPoints);
  }

  // Extract stop points from journey legs
  if (journeyData.journeys) {
    journeyData.journeys.forEach(journey => {
      if (journey.legs) {
        journey.legs.forEach(leg => {
          if (leg.departurePoint) {
            stopPoints.push(leg.departurePoint);
          }
          if (leg.arrivalPoint) {
            stopPoints.push(leg.arrivalPoint);
          }
          if (leg.path && leg.path.stopPoints) {
            stopPoints.push(...leg.path.stopPoints);
          }
        });
      }
    });
  }

  return stopPoints;
}

export function extractDisruptions(journeyData) {
  const disruptions = [];
  
  if (journeyData.disruptions) {
    disruptions.push(...journeyData.disruptions);
  }

  // Check for disruptions in journey legs
  if (journeyData.journeys) {
    journeyData.journeys.forEach(journey => {
      if (journey.legs) {
        journey.legs.forEach(leg => {
          if (leg.disruptions) {
            disruptions.push(...leg.disruptions);
          }
        });
      }
    });
  }

  return disruptions;
}

export function createSummary(journeyData) {
  const summary = {
    totalJourneys: journeyData.journeys ? journeyData.journeys.length : 0,
    totalAlerts: extractAlerts(journeyData).length,
    totalDisruptions: extractDisruptions(journeyData).length,
    totalStopPoints: extractStopPoints(journeyData).length,
  };

  if (journeyData.journeys && journeyData.journeys.length > 0) {
    const firstJourney = journeyData.journeys[0];
    summary.duration = firstJourney.duration;
    summary.startDateTime = firstJourney.startDateTime;
    summary.arrivalDateTime = firstJourney.arrivalDateTime;
  }

  return summary;
} 
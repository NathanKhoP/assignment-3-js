const targetTimes = {
  activity1: "05:00", 
  activity2: "03:30", 
  activity3: "10:15"  
};

document.addEventListener('DOMContentLoaded', () => {
  Object.keys(targetTimes).forEach((activity, index) => {
    const targetTimeElement = document.getElementById(`${activity}-target-time`);
    targetTimeElement.textContent = `Target time: ${targetTimes[activity]}`;
  });
});

document.querySelectorAll('.startButton').forEach((button, index) => {
  button.addEventListener('click', () => {
    const timeElement = document.querySelectorAll('.activitiesTime')[index];
    const stopButton = document.querySelectorAll('.stopButton')[index];
    let startTime = Date.now();
    button.disabled = true;
    stopButton.disabled = false;

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const minutes = Math.floor(elapsedTime / 60000);
      const seconds = ((elapsedTime % 60000) / 1000).toFixed(2);
      timeElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 100);

    stopButton.addEventListener('click', () => {
      clearInterval(interval);
      button.disabled = false;
      stopButton.disabled = true;
    });
  });
});

document.querySelectorAll('.stopButton').forEach((button) => {
  button.disabled = true;
});

document.querySelectorAll('.stopButton').forEach((button, index) => {
  button.addEventListener('click', () => {
    const activityName = document.querySelectorAll('.currentHeader')[index].textContent;
    const recordedTime = document.querySelectorAll('.activitiesTime')[index].textContent;
    const targetTime = targetTimes[`activity${index + 1}`]; // get targettime
    const table = document.querySelector('table');
    const newRow = table.insertRow();
    const activityCell = newRow.insertCell(0);
    const targetCell = newRow.insertCell(1);
    const timeCell = newRow.insertCell(2);
    const performanceCell = newRow.insertCell(3);

    activityCell.textContent = activityName;
    targetCell.textContent = targetTime;
    timeCell.textContent = recordedTime;

    // Performance calculation
    const targetParts = targetTime.split(':').map(Number);
    const recordedParts = recordedTime.split(':').map(Number);

    const targetSeconds = targetParts[0] * 60 + targetParts[1];
    const recordedSeconds = recordedParts[0] * 60 + recordedParts[1];

    let performance;
    performance = (targetSeconds / recordedSeconds) * 100; 
    

    performanceCell.textContent = `${performance.toFixed(2)}%`;

    button.disabled = true;
    document.querySelectorAll('.startButton')[index].disabled = false;
  });
});

window.addEventListener('beforeunload', () => {
  const activities = [];
  document.querySelectorAll('table tr').forEach((row, index) => {
    if (index > 0) {
      const cells = row.querySelectorAll('td');
      activities.push({
        activity: cells[0].textContent,
        target: cells[1].textContent,
        time: cells[2].textContent,
        performance: cells[3].textContent
      });
    }
  });
  localStorage.setItem('pastActivities', JSON.stringify(activities));
});

window.addEventListener('load', () => {
  const savedActivities = JSON.parse(localStorage.getItem('pastActivities')) || [];
  const table = document.querySelector('table');
  savedActivities.forEach(activity => {
    const newRow = table.insertRow();
    const activityCell = newRow.insertCell(0);
    const targetCell = newRow.insertCell(1);
    const timeCell = newRow.insertCell(2);
    const performanceCell = newRow.insertCell(3);

    activityCell.textContent = activity.activity;
    targetCell.textContent = activity.target;
    timeCell.textContent = activity.time;
    performanceCell.textContent = activity.performance;
  });
});

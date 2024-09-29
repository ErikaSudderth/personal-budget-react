import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

function Chart1(props) {
  var budgets = [];
  var titles = [];
  for (var i = 0; i < props.budgetData.myBudget.length; i++) {
    budgets[i] = props.budgetData.myBudget[i].budget;
    titles[i] = props.budgetData.myBudget[i].title;
  }

  console.log(budgets);

  var dataSource = {
    datasets: [
      {
        data: budgets || [],
        backgroundColor: [
          "#ffcd56",
          "#ff6384",
          "#36a2eb",
          "#fd6b19",
          "#00FF00",
          "#800080",
          "#FFA500"
        ]
      }
    ],
    labels: titles || []
  };

  return <Pie data={dataSource} />;
}

export default Chart1;

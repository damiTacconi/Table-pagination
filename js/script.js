import Pagination from "./pagination.js";
import data from "./mockData.js";

const loadData = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });

export default function DataTable(array, table) {
  this.table = table
  this.mockData = array || [];
  this.addRow = data => {
    const row = document.createElement("TR");
    for (let property in data) {
      if (property !== "id") {
        let col = this.addColumn(data[property]);
        row.append(col);
      }
    }
    this.table.querySelector("tbody").append(row);
  };

  this.addColumn = data => {
    const column = document.createElement("TD");
    column.innerHTML = data;
    return column;
  };

  this.renderTable = () => {
    this.table.querySelector("tbody").innerHTML = "";
    this.mockData.forEach(data => {
      this.addRow(data);
    });
  };

  this.loadSelectFields = () => {
    const field = document.getElementById("field");
    for (let property in this.mockData[0]) {
      if (property !== "id") this.addOption(field, property);
    }
  };
  this.addOption = (field, prop) => {
    const option = document.createElement("OPTION");
    option.value = prop;
    option.innerHTML = prop;
    field.append(option);
  };

  this.reorder = () => {
    const field = document.getElementById("field").value.toLocaleLowerCase();
    const order = document.getElementById("order").value;
    this.mockData.sort((a, b) => {
      if (order === "ASC") return a[field] > b[field] ? 1 : -1;
      else return a[field] < b[field] ? 1 : -1;
    });
  }

  this.setMockData = (mockData) => {
    this.mockData = mockData;
  }

  this.loadSelectFields();
}

window.onload = loadData().then(response => {
  const paginator = new Pagination(response, document.getElementById("table"));
  paginator.options(
    {
      range: 4,
      limit: 10,
      shortcuts: true
    });
  paginator.init();

});

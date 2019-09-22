import DataTable from "./script.js";

export default class Pagination {
    constructor(array, table, limit = 10) {
        this.dataTable = new DataTable(array, table);
        this.dataTable.renderTable();
        this.allData = array;
        this.table = table;
        this.limit = limit;
        this.currentPage = 0;
        this.range = 3;
        this.paginator = [];
        this.start = 0;
        this.end = 0;
        this.shortcuts = true;
        this.ulHTML = document.getElementById("pagination");
        document.getElementById("orderSearch").onclick = () => {
            this.dataTable.setMockData(this.allData);
            this.dataTable.reorder();
            this.init();
        }

    }

    changePage(index) {
        this.currentPage = index < this.paginator.length && index >= 0 ? index : this.currentPage;
        this.init();
    }

    divide() {
        this.paginator = [];
        var i, j, temparray, chunk = this.limit;
        for (i = 0, j = this.allData.length; i < j; i += chunk) {
            temparray = this.allData.slice(i, i + chunk);
            this.paginator = [...this.paginator, temparray];
        }
    }
    createButton(name, onclick) {
        const button = document.createElement("BUTTON");
        button.innerHTML = name;
        button.onclick = () => onclick();
        return button;
    }
    lastPage() {
        return this.paginator.length - 1;
    }
    renderFirst() {
        const li = document.createElement("LI");
        const button = this.createButton(1, () => this.changePage(0));
        li.append(button);
        button.style.fontWeight = "bold";
        this.ulHTML.append(li);
    }
    renderLast() {
        const li = document.createElement("LI");
        const button = this.createButton(this.paginator.length, () => this.changePage(this.lastPage()));
        li.append(button);
        button.style.fontWeight = "bold";
        this.ulHTML.append(li);
    }
    renderPrev() {
        const li = document.createElement("LI");
        const button = this.createButton("Prev", () => this.changePage(this.currentPage - 1));
        if (this.currentPage == 0) button.setAttribute("disabled", true);
        li.append(button);
        this.ulHTML.append(li);
    }
    renderNext() {
        const li = document.createElement("LI");
        const button = this.createButton("Next", () => this.changePage(this.currentPage + 1));
        if (this.currentPage == this.lastPage()) button.setAttribute("disabled", true);
        li.append(button);
        this.ulHTML.append(li);
    }
    render() {
        this.ulHTML.innerHTML = "";
        this.renderPrev();
        if (this.currentPage > this.range && this.shortcuts)
            this.renderFirst();
        for (let i = this.start; i < this.end; i++) {
            const li = document.createElement("LI");
            const button = this.createButton(i + 1, () => this.changePage(i));
            if (this.currentPage == i) {
                button.classList.add("btn-active");
            }
            button.innerHTML = i + 1;
            li.append(button);
            this.ulHTML.append(li);
        }
        if (this.currentPage < this.lastPage() - this.range && this.shortcuts)
            this.renderLast();
        this.renderNext();
    }
    update() {
        this.start = 0, this.end = 0;
        const extra = this.shortcuts ? 1 : 0;
        //MIDDLE
        if (this.currentPage > this.range && this.currentPage + this.range + extra < this.paginator.length) {
            this.start = this.currentPage - this.range;
            this.end = this.currentPage + this.range + 1;
        }
        //START
        else if (this.currentPage <= this.range && this.range * 2 + 1 < this.paginator.length) {
            this.end = this.range * 2 + 1 + extra;
        }
        //END
        else if (this.lastPage() - this.range * 2 - extra > 0) {
            this.start = this.lastPage() - this.range * 2 - extra;
            this.end = this.paginator.length;
        }
        else this.end = this.paginator.length;

    }
    options(options) {
        this.range = options.range || 3;
        this.currentPage = options.currentPage || 0;
        this.limit = options.limit || 10;
        this.shortcuts = typeof options.shortcuts === "boolean" ? options.shortcuts : true;
    }

    init() {
        this.divide();
        this.dataTable.setMockData(this.paginator[this.currentPage]);
        this.dataTable.renderTable();
        this.shortcuts = this.range * 2 + 1 < this.lastPage() ? this.shortcuts : false;
        this.update();
        this.render();
    }
}
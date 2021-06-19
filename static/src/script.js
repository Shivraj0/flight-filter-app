import { DATA } from '../../data/airports.js';
import { DATA_COLUMNS } from '../constants/index.js';
import { getDataOnEvent } from '../utils/index.js';

// Create and render new list of elements in table based on user input.
function fetchData(event) {
    const inputValue = event.target.value.toLowerCase();    
    const dataColumnsArray = Object.values(DATA_COLUMNS);
    console.log(inputValue); // Check console for which input search is been fired.

    if(inputValue !== null || inputValue !== undefined) {
        const filteredList = DATA.filter((element) => {
            let isValid = false;
            
            for(let i = 0 ; i < dataColumnsArray.length ; i++) {
                let dataValue = element[dataColumnsArray[i]];
                dataValue = String(dataValue).toLowerCase();

                if(dataValue === inputValue) {
                    isValid = true;
                    break;
                }
            }

            return isValid;
        });

        if(filteredList.length > 0) {
            renderData(filteredList);
        }
    }

    // This is required since when user cleared the input field we need to render the initial data as it is.
    if(inputValue === '') {
        renderData(DATA);
    }
}

const getDataFromInput = getDataOnEvent(fetchData, 300); // Note: Here `getDataOnEvent` is a debounced function.

// Event listener for search event.
function inputSearchEvent() {
    const inputElement = document.querySelector('.js-search-input');
    inputElement.addEventListener('keyup', getDataFromInput)
}

// Function to filter data on checked state basis.
function filterDataOnCheck() {
    let checkboxList = document.querySelector('.js-checkbox-list');
    const checkboxListItems = Object.values(checkboxList.children);

    let checkedOptions = {};
    checkboxListItems.forEach(element => {
        const targetElement = element.children[0];
        targetElement.dataset.checked === 'true' ? checkedOptions[targetElement.dataset.label] = true : null})

    const filteredData = DATA.filter(element => checkedOptions.hasOwnProperty(element.type));
    Object.keys(checkedOptions).length === 0 ? renderData(DATA) : renderData(filteredData);
    
    console.log(checkedOptions); // Check console for checked options.
    console.log(filteredData); // Check console for filtered list.
}

// Event listener for check event.
function inputCheckEvent() {
    let checkboxList = document.querySelector('.js-checkbox-list');
    checkboxList.addEventListener('click', function onCheckboxClick(event) {
        const dataset = event.target.dataset;
        if(Object.keys(dataset).length !== 0) {
            dataset.checked === "true" ? dataset.checked = "false" : dataset.checked = "true";
        }

        filterDataOnCheck();
    });
}

// Add elements in table on render.
function setTableData(dataObject) {
    let rowElement = document.createElement('tr');

    for(let i = 0 ; i < 7 ; i++) {
        let dataElement = document.createElement('td');
        dataElement.innerText = dataObject[DATA_COLUMNS[i]];
        rowElement.appendChild(dataElement);
    }

    return rowElement;
}

// Function to render data on input search.
function renderData(dataList) {
    let bodyElement = document.querySelector('.js-table-body');
    bodyElement.innerHTML = '';

    for(let i = 0 ; i < dataList.length && i < 4 ; i++) {
        const rowElement = setTableData(dataList[i]);
        bodyElement.appendChild(rowElement);
    }
}

// Function to render data on Initial render.
function renderInitialData(tableData) {

    let bodyElement = document.querySelector('.js-table-body');
    bodyElement.innerHTML = '';

    for(let i = 0 ; i < 4 ; i++) {
        const rowElement = setTableData(tableData[i]);
        bodyElement.appendChild(rowElement);
    }
}

function registerEvents() {
    renderInitialData(DATA);
    inputSearchEvent();
    inputCheckEvent();
}

window.addEventListener('load', registerEvents);

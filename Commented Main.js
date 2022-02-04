    //Frame Maker 2.0
    /*
    Stuff to Add

    -start with/contains/ends with
    -textbox to be able to edit the script and see what it does
    -Languages?
    -add ability to write in another css selector
    */

    var maxMavSelectors = 2;

    //get username to ignore in titles
    var username = document.querySelector('.avatar-initials,[src*="personImage?personId="]');
    username = username? username.getAttribute('title'): "DEFAULT_VALUE"
        

    //Titles to ignore
    var ignoreTitle = ["Navigator", "Oracle Logo Home", "Search", "Clear", "Personalize...", "Search", "Home", "Favorites and Recent Items", "Watchlist", "Access Accessibility Settings", "Settings and Actions Menu", "Application Message", "Image is hidden.  This element can be ignored.", "Error", "Critical Error", "Information", "Warning", "At least one is required", "Sort Ascending", "Sort Descending", "Help", "Required", "Overflow", "AFRequiredIconShortDesc", "Resize", "Scroll Up", "Scroll Down","Starts With","List all tabs", "Close", "All People","Collapse Search","Collapse Search Results","Show previous panels","Show next panels", "Continue","Hide tab text", username];

    var ignoreClass = ["_afrImageNotLoadedInTime"];

    function getTitles() {
        var titles = document.querySelectorAll('[title]');
        //turn into Array
        titles = Array.from(titles);
        //get username to ignore in titles
        username = document.querySelector('.avatar-initials,[src*="personImage?personId="]').getAttribute('title');
        
        let acceptableTitles = [];

        for (let titleElement of titles) {
            let testTitle = titleElement.getAttribute("title");
            let testClass = titleElement.getAttribute("class");
            if (!ignoreTitle.includes(testTitle)  && !testTitle.includes("Notifications ") && titleElement.className && titleElement.getAttribute("title")!='') {
                acceptableTitles.push(titleElement);
            }
        }

        return acceptableTitles;
    }

    function generateTitleUI(titles) {
        let styleElement = document.querySelector('style[mav-style]');

        if (!styleElement) {
            styleElement = document.createElement('style');

            styleElement.textContent = `

            .containerMAV {
                overflow-y: auto;
                margin: 0 36px;
            }
            .containerMAV thead th {
                position: sticky;
                top: 0;
            }
            .containerMAV table {
                border-collapse: collapse;
                width: 100%;
            }

            .containerMAV th,
            .containerMAV td {
                padding: 8px 16px;
            }
            .containerMAV th {
                background: #eee;
            }
            .containerMAV,
            .containerMAV td {
                box-shadow: inset 1px -1px #000;
            }
            .containerMAV th {
                box-shadow: inset 1px 1px #000, 0 1px #000;
            }

            .containerMAV tr td {
                cursor: pointer;
            }

            .popoverMAV{
                position: fixed; /* Stay in place */
                z-index: 1099; /* Sit on top */
                left: 0;
                top: 0;
                width: 100%; /* Full width */
                height: 100%; /* Full height */
                overflow: auto; /* Enable scroll if needed */
                display: grid;
                align-content: start;
                justify-content: center;
            }
            
            .popoverBodyMAV{
                background: #fff;
                border-radius: 10px;
                width: 40vw;
                height: 50vh;
                overflow: hidden;
                border: 1px solid black;
                display: grid;
                box-shadow: 0px 0px 36px 0px rgb(0 0 0 / 50%);
            }

            .titleMAV{
                font-size: 2vh;
                font-weight: 600;
                text-align: center;
                margin: 16px;
            }

            .footerMAV{
                display: flex;
                align-content: center;
                justify-content: space-evenly;
                margin: 18px 36px;
            }

            .buttonMAV{
                height: 48px;
                min-width: 116px;
                font-weight: 600;
                font-size: 1.25em;
            }

            [data-mavisfull=true] tr{
                background: #f5f5f5;
                color: #898989;
            }

            [data-mavselected="true"]{
                background: #c0f3ff !important;
                color: #000000 !important;
                font-weight: 600;
            }
            .hoverTarget{
                border-style: groove !important;
                background: #fafad270 !important;
            }
            .containerMAV tr:hover {
                background: #e3e3e3;
                transition: 100ms;
            }
            .textboxMAV {
                min-width: 200px;
                min-height: 100px;
                border-style: groove;
            }
            `;

            styleElement.setAttribute('mav-style', '');

            document.head.appendChild(styleElement);
        }

        var dynamicTable = generateTable(titles);

        let popover = document.createElement("div");
        popover.className = "popoverMAV";

        let popoverBodyMAV = document.createElement("div");
        popoverBodyMAV.className = "popoverBodyMAV";
        let footer = document.createElement("div");
        footer.className = "footerMAV";


        let title = document.createElement("div");
        title.className = "titleMAV";
        title.textContent = "Frame Maker 0.2";

        let editBox = document.createElement("div");

        let btnSubmit = document.createElement("button");
        btnSubmit.id = "btnCreateUser";
        btnSubmit.className = "buttonMAV";
        btnSubmit.textContent = "Copy";
        btnSubmit.addEventListener("click", e => {
            if(mavSelectors.length<2){
                alert("Error: Select at least two rows: \n" + mavSelectors.join('\n'));
            }
            if(mavSelectors[0]==mavSelectors[1]&&mavSelectors.length==2){
                alert("Error: Selectors cannot have same title and class: \n" + mavSelectors.join('\n'));
            }
            if(mavSelectors[0]!=mavSelectors[1] && mavSelectors.length==2)
            {
            var code="if(document.querySelector(\'"+mavSelectors[0]+"')&&\r\ndocument.querySelector(\'"+mavSelectors[1]+"'))\r\n{return true;}\r\nelse\r\n{return false;}";
                navigator.clipboard.writeText(code)
                .then(() => {

                })
                .catch(err => {
                console.log('Something went wrong', err);
                });
                
                alert("Selectors: \n" + mavSelectors.join('\n'));
                popover.remove();
                styleElement.remove();
            }
        });

        let btnCancel = document.createElement("button");
        btnCancel.id = "btnCancel";
        btnCancel.className = "buttonMAV";
        btnCancel.textContent = "Cancel";
        btnCancel.addEventListener("click", e => {
            popover.remove();
            styleElement.remove();
            
        });

        // let textboxView = document.createElement("button");
        // textboxView.id = "btnCancel";
        // textboxView.className = "buttonMAV";
        // textboxView.textContent = "Cancel";
        // textboxView.addEventListener("click", e => {
        //     popover.remove();
        //     styleElement.remove();
        // });

        popover.addEventListener("click", e => {
            if (e.target == popover) {
                popover.remove();
            }
        });

        let escapeAction = () => { };

        escapeAction = (e) => {
            if (e.key == "Escape") {
                popover.remove();
                styleElement.remove();
                document.removeEventListener('keydown', escapeAction);
            }
        };

        document.addEventListener('keydown', escapeAction);

        footer.appendChild(btnCancel);
        footer.appendChild(btnSubmit);

        popoverBodyMAV.appendChild(title);
        popoverBodyMAV.appendChild(dynamicTable);
        popoverBodyMAV.appendChild(footer);

        popover.appendChild(popoverBodyMAV);

        document.body.appendChild(popover);
    };
    var mavSelectors = [];

    function generateTable(titles) {    

        let tableContainer = document.createElement('div');
        tableContainer.className = "containerMAV";

        let table = document.createElement('table');
        let headerBody = document.createElement('thead');

        headerBody.insertAdjacentHTML('afterbegin', `<tr><th>Title Name</th><th>Class</th><th>CSS Selector</th></tr>`);
        table.appendChild(headerBody);

        let tbody = document.createElement('tbody');

        let handleRowClick = (e, selector, element) => {
            if (mavSelectors.length >= maxMavSelectors && !element.dataset.mavselected) {
                e.preventDefault();
                return false;
            }

            if (element.dataset.mavselected) {
                //console.log('hi');
                mavSelectors = mavSelectors.filter(x => { return x != selector });
                element.dataset.mavselected = '';
            } else {
                element.dataset.mavselected = true;
                mavSelectors.push(selector);
            }

            if (mavSelectors.length == maxMavSelectors) {
                tbody.dataset.mavisfull = true;
            } else {
                tbody.dataset.mavisfull = '';
            }
        };

        let handleRowHover = (e, selector, element) => {
            var hoverElementSelector = element.lastElementChild.innerText;
            var hoverElement = document.querySelector(hoverElementSelector);
            if (hoverElement){
                hoverElement.classList.add("hoverTarget");
            }
        };

        let handleRowHoverOff = (e, selector, element) => {
            var hoverElementSelector = element.lastElementChild.innerText;
            var hoverElement = document.querySelector(hoverElementSelector);
            if (hoverElement){
                hoverElement.classList.remove("hoverTarget");
            }
            
        };

        titles.forEach(titleElement => {
            let titleRow = document.createElement('tr');

            let titleName = document.createElement('td');
            titleName.textContent = titleElement.title;
            titleRow.appendChild(titleName);

            let titleClass = document.createElement('td');
            titleClass.textContent = titleElement.className;
            titleRow.appendChild(titleClass);

            let firstClass = Array.from(titleElement.classList)[0];

            let titleCSS = document.createElement('td');
            let selector = `.${firstClass}[title="${titleElement.title}"]`;
            titleCSS.textContent = selector;
            titleRow.appendChild(titleCSS);

            titleRow.addEventListener('click', e =>{
                handleRowClick(e, selector, titleRow);
            });

            titleRow.addEventListener("mouseover", e =>{
                handleRowHover(e, selector, titleRow);
            });

            titleRow.addEventListener("mouseout", e =>{
                handleRowHoverOff(e, selector, titleRow);
            });

            tbody.appendChild(titleRow)
        });

        table.appendChild(tbody);

        tableContainer.appendChild(table);

        return tableContainer;
    }

    generateTitleUI(getTitles());

// localStorage.clear();

// Major DOM Selectors and Variables
let todayContainer = document.querySelector(".today");
let tomorrowContainer = document.querySelector(".tomorrow");
let upcomingContainer = document.querySelector(".upcoming");
let completedContainer = document.querySelector(".completed");
let overdueContainer = document.querySelector(".overdue");

let todayList = document.querySelector(".today ul");
let completedList = document.querySelector(".completed ul");
let tomorrowList = document.querySelector(".tomorrow ul");
let upcomingList = document.querySelector(".upcoming ul");
let overdueList = document.querySelector(".overdue ul");

let addTaskBtn = document.querySelector("#open-modal");
let modalContainer = document.querySelector(".modal");

// Event listeners for functions to be carried out on every page reload
document.addEventListener("DOMContentLoaded", fetchTasks());
document.addEventListener("DOMContentLoaded", listenForButtonClicks());

// Opens a modal for adding tasks when user clicks on the Add Task "+" button
addTaskBtn.onclick = () => {
    // Refreshing the modal container so that the input autofocuses everytime and not only on first reload
    modalContainer.innerHTML = modalContainer.innerHTML;
    modalContainer.style.display = "block";  

    // Sets the default values of the date and time fields when adding tasks to the current date and time 
    document.querySelector("#date-input").defaultValue = new Date().toISOString().slice(0,10);
    document.querySelector("#time-input").defaultValue = new Date().toTimeString().slice(0,5);

    // Closes the modal when user clicks on the close button
    document.querySelector("#close-btn").addEventListener("click", () => {
        modalContainer.style.display = "none";
    });
};

// Closes the modal when the user clicks anywhere outside the modal 
window.onclick = (event) => {
    if (event.target == modalContainer) {
        modalContainer.style.display = "none";
    }
};

// Function to add tasks 
function addTask(event) {
    // Prevents window refresh when submitting form
    event.preventDefault()

    // Retrieving task information entered by the user
    let task = document.querySelector("#task-input").value;
    let date = document.querySelector("#date-input").value;
    let time = document.querySelector("#time-input").value
    let taskInfo = {"task": task, "date": date, "time": time};

    // Calling function to save task to the browser's Local Storage
    saveTask(taskInfo); 

    // Closes the modal when the user successfully adds a task
    modalContainer.style.display = "none";

    // Calculating today's date and tomorrow's date for further use
    let todayDate = new Date().toISOString().slice(0,10);
    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    let tomorrowDate = tomorrow.toISOString().slice(0,10)
    
    // Task to be added to the HTML as a list item 
    let insertHTMLText = `<li>     
    <span class="group-items">
    <button class="delete-btn"><i class="fas fa-times-circle"></i></button>
    <button class="complete-btn"><i class="fas fa-check-circle"></i></button>
    <mark class="date-html">${date}</mark>
    <mark class="time-html">${time}</mark>
    </span>
    <span class="group-items">
    <span class="task-html">${task}</span>
    </span>
    </li>`;

    // Displaying tasks under the relevant tab based on the task's date, and hiding all other tabs
    if (date === todayDate) {
        todayList.insertAdjacentHTML("beforeend", insertHTMLText);
        upcomingList.insertAdjacentHTML("beforeend", insertHTMLText);
        todayContainer.style.display = "block";
        $(".today").siblings().css({"display": "none"});
        document.querySelectorAll(".tabs button").forEach(button => {button.disabled= false});
        document.querySelector("#today").disabled = true;
    } else if (date === tomorrowDate) {
        tomorrowList.insertAdjacentHTML("beforeend", insertHTMLText);
        upcomingList.insertAdjacentHTML("beforeend", insertHTMLText);
        tomorrowContainer.style.display = "block";
        $(".tomorrow").siblings().css({"display": "none"});
        document.querySelectorAll(".tabs button").forEach(button => {button.disabled= false});
        document.querySelector("#tomorrow").disabled = true;
    } else if (date < todayDate) {
        overdueList.insertAdjacentHTML("beforeend", insertHTMLText);
        overdueContainer.style.display = "block";
        $(".overdue").siblings().css({"display": "none"});
        document.querySelectorAll(".tabs button").forEach(button => {button.disabled= false});
        document.querySelector("#overdue").disabled = true;
    } else if (date > todayDate) {
        upcomingList.insertAdjacentHTML("beforeend", insertHTMLText);
        upcomingContainer.style.display = "block";
        $(".upcoming").siblings().css({"display": "none"});
        document.querySelectorAll(".tabs button").forEach(button => {button.disabled= false});
        document.querySelector("#upcoming").disabled = true;
    }

    // Calling function to trigger listener for certain button clicks at all necessary instances after the first reload
    listenForButtonClicks();
}

// Function to save the entered task to the browser's Local Storage
function saveTask(taskInfo) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.push(taskInfo);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to fetch tasks from Local Strorage and render them on the HTML on every page reload
function fetchTasks() {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.forEach(function(taskInfo) {
        let task = taskInfo["task"];
        let date = taskInfo["date"];
        let time = taskInfo["time"];

        // Calculating today's date and tomorrow's date for further use
        let todayDate = new Date().toISOString().slice(0,10);
        let tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        let tomorrowDate = tomorrow.toISOString().slice(0,10)

        // Task to be added to the HTML as a list item 
        let insertHTMLText = `<li>
        <span class="group-items">     
        <button class="delete-btn"><i class="fas fa-times-circle"></i></button>
        <button class="complete-btn"><i class="fas fa-check-circle"></i></button>
        <mark class="date-html">${date}</mark>
        <mark class="time-html">${time}</mark>
        </span>
        <span class="group-items">
        <span class="task-html">${task}</span>
        </span>
        </li>`;

        // Displaying tasks under the relevant tab based on the task's date, and hiding all other tabs
        if (date === todayDate) {
            todayList.innerHTML += insertHTMLText;
            upcomingList.innerHTML += insertHTMLText;  
        } else if (date === tomorrowDate) {
            tomorrowList.innerHTML += insertHTMLText;  
            upcomingList.innerHTML += insertHTMLText;  
        } else if (date < todayDate) {
            overdueList.innerHTML += insertHTMLText;  
        } else if (date > todayDate) {
            upcomingList.innerHTML += insertHTMLText;  
        }
    })

    // Fetching list of Completed Tasks from Local Storage
    let completedTasks;
    if (localStorage.getItem("completedTasks") === null) {
        completedTasks = [];
    } else {
        completedTasks = JSON.parse(localStorage.getItem("completedTasks"));
    }
    completedTasks.forEach(function(taskInfo) {
        let task = taskInfo["task"];
        let date = taskInfo["date"];
        let time = taskInfo["time"];
        completedList.innerHTML +=  
            `<li>     
            <span class="group-items">     
            <mark class="date-html">${date}</mark>
            <mark class="time-html">${time}</mark>
            </span>
            <span class="group-items">     
            <span class="task-html">${task}</span>
            </span>
            </li>`;
    });
}

/* Function to Remove Tasks when user completes it or deletes it.
If a task is designated for today or tomorrow, ensure that it is removed from both 
"Today"/"Tomorrow" and "Upcoming" lists when user completes/deletes the task */ 
function removeTaskFromAllCategories(taskDate, todayDate, tomorrowDate, parentListItem) {
    if (taskDate < todayDate) {
        // Changing the play state of task fade out animation to "running"
        parentListItem.style.animationPlayState = "running";

        parentListItem.addEventListener("animationend", () => {
            parentListItem.remove();
        })
    } else if (taskDate === todayDate) {
        if (parentListItem.parentElement.parentElement.classList.contains("today")) {
            let searchListItem = parentListItem.outerHTML;
            for (i=0; i<(document.querySelector(".upcoming ul").children).length ; i++) {
                if (document.querySelector(".upcoming ul").children[i].outerHTML === searchListItem) {
                    var deleteIndex = i;
                    break
                }
            } 
            // Changing the play state of task fade out animation to "running"
            parentListItem.style.animationPlayState = "running";
            
            document.querySelector(".upcoming ul").children[deleteIndex].remove();    
            parentListItem.addEventListener("animationend", () => {
                parentListItem.remove();
            })

        } else if (parentListItem.parentElement.parentElement.classList.contains("upcoming")) {
            let searchListItem = parentListItem.outerHTML;
            for (i=0; i<(document.querySelector(".today ul").children).length ; i++) {
                if (document.querySelector(".today ul").children[i].outerHTML === searchListItem) {
                    var deleteIndex = i;
                    break
                }
            } 
            // Changing the play state of task fade out animation to "running"
            parentListItem.style.animationPlayState = "running";
            
            document.querySelector(".today ul").children[deleteIndex].remove();
            parentListItem.addEventListener("animationend", () => {
                parentListItem.remove();
            })
        }
    } else if (taskDate === tomorrowDate) {
        if (parentListItem.parentElement.parentElement.classList.contains("tomorrow")) {
            let searchListItem = parentListItem.outerHTML;
            for (i=0; i<(document.querySelector(".upcoming ul").children).length ; i++) {
                if (document.querySelector(".upcoming ul").children[i].outerHTML === searchListItem) {
                    var deleteIndex = i;
                    break
                }
            } 
            // Changing the play state of task fade out animation to "running"
            parentListItem.style.animationPlayState = "running";

            document.querySelector(".upcoming ul").children[deleteIndex].remove();
            parentListItem.addEventListener("animationend", () => {
                parentListItem.remove();
            })
        } else if (parentListItem.parentElement.parentElement.classList.contains("upcoming")) {
            let searchListItem = parentListItem.outerHTML;
            for (i=0; i<(document.querySelector(".tomorrow ul").children).length ; i++) {
                if (document.querySelector(".tomorrow ul").children[i].outerHTML === searchListItem) {
                    var deleteIndex = i;
                    break
                }
            } 
            // Changing the play state of task fade out animation to "running"
            parentListItem.style.animationPlayState = "running";

            document.querySelector(".tomorrow ul").children[deleteIndex].remove();
            parentListItem.addEventListener("animationend", () => {
                parentListItem.remove();
            })
        }
    } else {
        // Changing the play state of task fade out animation to "running"
        parentListItem.style.animationPlayState = "running";

        parentListItem.addEventListener("animationend", () => {
            parentListItem.remove();
        })
    }
}

// Function to trigger listener for certain button clicks at all necessary instances after the first reload
function listenForButtonClicks() {    

    // Complete Button - when the user clicks on the button to complete a task, add task to the Completed tab
    document.querySelectorAll(".complete-btn").forEach(button => {
        button.onclick = function() {
            // Finding index of task under the current tab to remove it from Local Storage
            let parentListItem = this.parentElement.parentElement;
            let taskName = parentListItem.querySelector(".task-html").innerHTML;
            let taskDate = parentListItem.querySelector(".date-html").innerHTML;
            let taskTime = parentListItem.querySelector(".time-html").innerHTML;
            let tasks = JSON.parse(localStorage.getItem("tasks"));
            let taskIndex = tasks.findIndex( (element) => element.task === taskName && element.date === taskDate && element.time === taskTime );
            let completedTask = tasks[taskIndex];
            let completedTasks;
            if (localStorage.getItem("completedTasks") === null) {
                completedTasks = [];
            } else {
                completedTasks = JSON.parse(localStorage.getItem("completedTasks"));
            }
            completedTasks.unshift(completedTask);
            localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

            completedList.innerHTML = "";
            completedTasks.forEach(function(taskInfo) {
                let task = taskInfo["task"];
                let date = taskInfo["date"];
                let time = taskInfo["time"];
                completedList.innerHTML +=  
                    `<li>  
                    <span class="group-items">     
                    <mark class="date-html">${date}</mark>
                    <mark class="time-html">${time}</mark>   
                    </span>
                    <span class="group-items">     
                    <span class="task-html">${task}</span>
                    </span>
                    </li>`;
            });

            tasks.splice(taskIndex,1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        
            // Calculating today's date and tomorrow's date for further use
            let todayDate = new Date().toISOString().slice(0,10);
            let tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            let tomorrowDate = tomorrow.toISOString().slice(0,10)

            /* Calling function to remove task from all categories */ 
            removeTaskFromAllCategories(taskDate, todayDate, tomorrowDate, parentListItem)

        }
    });  
    
    // Delete Button - when the user clicks on the button to delete a task
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.onclick = function() {
            // Finding index of task under the current tab to remove it from Local Storage
            let parentListItem = this.parentElement.parentElement;
            let taskName = parentListItem.querySelector(".task-html").innerHTML;
            let taskDate = parentListItem.querySelector(".date-html").innerHTML;
            let taskTime = parentListItem.querySelector(".time-html").innerHTML;
            let tasks = JSON.parse(localStorage.getItem("tasks"));
            let taskIndex = tasks.findIndex( (element) => element.task === taskName && element.date === taskDate && element.time === taskTime );
            tasks.splice(taskIndex,1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            
            // Calculating today's date and tomorrow's date for further use
            let todayDate = new Date().toISOString().slice(0,10);
            let tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            let tomorrowDate = tomorrow.toISOString().slice(0,10)

            /* Calling function to remove task from all categories */ 
            removeTaskFromAllCategories(taskDate, todayDate, tomorrowDate, parentListItem);
        }
    });

    // Tab Buttons - when the user clicks on task tabs, namely: Completed, Overdue, Today, Tomorrow, Upcoming
    document.querySelectorAll(".tab-btn").forEach(button => {
        button.onclick = function() {
            btnClickedTab = this.dataset.tab;

            // Disable the currently selected tab button
            document.querySelectorAll(".tab-btn").forEach(button => {
                if (button.dataset.tab != btnClickedTab) {
                    button.disabled = false;
                } else {
                    button.disabled = true;
                }
            });

            // Display the selected tab's container and Hide all others
            if (button.dataset.tab === "completed") {
                completedContainer.style.display = "block";
                $(".completed").siblings().css({"display": "none"});
                // todayContainer.style.display = "none";
            } else if (button.dataset.tab === "today") {
                todayContainer.style.display = "block";
                $(".today").siblings().css({"display": "none"});
            } else if (button.dataset.tab === "tomorrow") {
                tomorrowContainer.style.display = "block";
                $(".tomorrow").siblings().css({"display": "none"});
            } else if (button.dataset.tab === "upcoming") {
                upcomingContainer.style.display = "block";
                $(".upcoming").siblings().css({"display": "none"});
            } else {
                overdueContainer.style.display = "block";
                $(".overdue").siblings().css({"display": "none"});
            };
        }
    })
};
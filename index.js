let btnSubmit = document.getElementById(`submit`)
let submitForm = document.getElementById(`form`)
let tasks = document.getElementById(`task`)
let containerLists = document.getElementById(`container-lists`)
let customAlert = document.getElementById(`custom-alert`)
let alertMessage = document.getElementById(`alert-message`)
let alertOkMessage = document.getElementById(`alert-ok-button`)
let taskNumber = document.querySelector(`.tasks-number p`)
let progressBar = document.getElementById(`progress`)



let toDotasks = []

submitForm.addEventListener(`submit`, taskForm)

   function taskForm(event){
        event.preventDefault()
    
        let taskInput = tasks.value.trim()

        if(!taskInput){
            showAlert(`Please, enter your tasks`)
            return
        }
        
    
        const createdTasks = {
            taskName : taskInput,
            completed : false
        }
    
        toDotasks.push(createdTasks)
        localStorage.setItem(`todoItem`, JSON.stringify(toDotasks))
        submitForm.reset()
        displayTasks()
        updateTaskStats() 
    }

    
    
    // To show and hide alert pops
    alertOkMessage.addEventListener(`click`, hideAlert)

    function showAlert(message){
        alertMessage.textContent = message
        customAlert.style.display = "flex"

    }

    function hideAlert(){
        customAlert.style.display = `none`
    }

    
    // To retrieve the data from local storage

    function fetchTasks(){
        if(localStorage.getItem(`todoItem`)){
            toDotasks = JSON.parse(localStorage.getItem(`todoItem`))
        }
        displayTasks()
        updateTaskStats()
    }
    fetchTasks()

    
    
    // TO Display the tasks

    function displayTasks(){
        taskDisplayhtml = ``
        for(let i = 0; i < toDotasks.length; i++){
           let item =  toDotasks[i]

           let completedClass = item.completed ? `completed` : ``

           taskDisplayhtml +=`                  
           <div class="content-lists ${completedClass}">
                <div class="above-elements">
                    <label class="custom-checkbox">
                        <input type="checkbox" ${item.completed ? "checked" : ""} onchange="toggleComplete(${i})">
                        <span class="checkmark"></span>
                    </label>
                    <div class="icon-elements">
                        <span class="material-symbols-sharp" onclick="editTask(${i})">edit_square</span>
                        <span class="material-symbols-sharp" onclick="deleteTask(${i})">delete</span>
                    </div>
                </div>

                <div class="below-text">
                    <p>${item.taskName}</p>
                </div>
            </div>`
        }
        containerLists.innerHTML = taskDisplayhtml

    }

    function toggleComplete(index){
        toDotasks[index].completed = !toDotasks[index].completed

        localStorage.setItem(`todoItem`, JSON.stringify(toDotasks))
        displayTasks()
        updateTaskStats()
    }


    function editTask(index) {
        let taskToEdit = toDotasks[index];
        tasks.value = taskToEdit.taskName;
        btnSubmit.textContent = "Update";
        btnSubmit.style.fontSize = `0.87rem`
        btnSubmit.style.backgroundColor = `#4281a4`
        btnSubmit.style.border = `none`
        btnSubmit.style.color = `white`
        btnSubmit.onclick = function (event) {
            event.preventDefault();
            let updatedTask = tasks.value.trim();
            if (!updatedTask) {
                showAlert("Please enter a task!");
                return;
            }

            if (toDotasks[index].completed) {
                showAlert("This task was marked as completed. It will now be treated as a new task.");
            }
        
            toDotasks[index].taskName = updatedTask;
            toDotasks[index].completed = false
            localStorage.setItem(`todoItem`, JSON.stringify(toDotasks));
            submitForm.reset();
            btnSubmit.textContent = "+";
            btnSubmit.style.fontSize = `2rem`
            btnSubmit.style.color = `#000`
            btnSubmit.style.backgroundColor = `#f8ebdc`
            btnSubmit.style.border = `1px solid #000`
            btnSubmit.onclick = null;
            displayTasks();
            updateTaskStats()
        };
    }

    // To delete an item

    function deleteTask(index){
        toDotasks.splice(index, 1)
        localStorage.setItem(`todoItem`, JSON.stringify(toDotasks));
        displayTasks()
        updateTaskStats()
    }


    // Function to update tasks progress

    function updateTaskStats(){
        const totalTasks = toDotasks.length
        const completedTasks = toDotasks.filter(function(task){
            return task.completed
        }).length

        // Updating the number
        taskNumber.textContent = `${completedTasks} / ${totalTasks}`
        
        // Updating the progress
        let progressPercent
        if(totalTasks === 0){
            progressPercent = 0
        }else{
           progressPercent = (completedTasks)/(totalTasks) * 100
        }

        progressBar.style.width = `${progressPercent}%`

        if(completedTasks === totalTasks){
            blastConfetti()
        }
    }


    function blastConfetti(){
        const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

        function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
            })
        );
        }

        fire(0.25, {
        spread: 26,
        startVelocity: 55,
        });

        fire(0.2, {
        spread: 60,
        });

        fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        });

        fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        });

        fire(0.1, {
        spread: 120,
        startVelocity: 45,
        });
    }
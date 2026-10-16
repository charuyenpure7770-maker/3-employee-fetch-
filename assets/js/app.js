const cl = console.log;
const spinner = document.getElementById("spinner");
const empForm = document.getElementById("empForm");
const eNameControl = document.getElementById("eName");
const departmentControl = document.getElementById("department");
const salaryControl = document.getElementById("salary");
const cityControl = document.getElementById("city");
const  empInfo= document.getElementById("empInfo");
const  submitBtn= document.getElementById("submitBtn");
const  updateBtn= document.getElementById("updateBtn");

//url
const BASE_URL = "https://fetch-api-crud-e52ad-default-rtdb.asia-southeast1.firebasedatabase.app"
const Emp_URL = `${BASE_URL}/students.json`

//spinner
function toggleSpinner(){
    spinner.classList.toggle("d-none");
}
//snakbar
function snackBar(msg, icon){
    Swal.fire({
        text:msg,
        icon:icon,
        timer:2500
    })
}
//state
const state = {
    empArr:[],
    edit_id :null
}
// index no 
function index(){
    let td = [...document.querySelectorAll("#empInfo tr td:first-child")]
    td.forEach((ele,i)=>{
        ele.innerText = i+1
    })
}

//create

function onAddEmp(eve){
    eve.preventDefault();
    let newObj = {
        city: cityControl.value.trim(),
        department:departmentControl.value.trim(),
        name: eNameControl.value.trim(),
        salary: salaryControl.value 
    }
    toggleSpinner();
    fetch(Emp_URL,{
        method:"POST",
        body:JSON.stringify(newObj),
        headers:{
            "content-type":"application/json",
            "authorization":"JWT TOKEN"
        }
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error("something went wrong")
        }
        return res.json();
    })
    .then((data)=>{
        cl(data);
        newObj.id = data.name;
        state.empArr.unshift(newObj);
        let tr = document.createElement("tr");
        tr.id = data.name;
        tr.innerHTML =`                         <td>${1}</td>
                                                <td>${newObj.name}</td>
                                                <td>${newObj.department}</td>
                                                <td>${newObj.salary}</td>
                                                <td>${newObj.city}</td>
                                                <td><button onclick="onEdit(this)" class="btn btn-sm btn-block btn-primary">Edit</button></td>
                                                <td><button onclick="onRemove(this)" class="btn btn-sm btn-block btn-danger">Remove</button></td>`
                
                                                empInfo.prepend(tr);
                                                index();
                                                snackBar("employee record created successfully!!","success");
                                                empForm.reset();
    })
    .catch((err)=>{
    snackBar(err.message,"error")
    })
    .finally(()=>{
        toggleSpinner()
    })
}
empForm.addEventListener("submit",onAddEmp);

//read
function showOnUi(){
    toggleSpinner();
    fetch(Emp_URL,{
        method:"GET",
        body:null,
        headers:{
            "content-type":"application/json",
            "authorization":"JWT TOKEN" 
        }
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error("something went wrong")
        }
        return res.json();
    })
    .then((data)=>{
        cl(data);
        for(const key in data){
            data[key].id = key;
            state.empArr.unshift(data[key]);
        }
        templeting(state.empArr);
    })
    .catch((err)=>{
    snackBar(err.message,"error")
    })
    .finally(()=>{
        toggleSpinner()
    })
}

//templeting

function templeting(arr){
    let result = ``;
    arr.forEach((ele,i)=>{
        result += `<tr id="${ele.id}">
                 <td>${i+1}</td>
                 <td>${ele.name}</td>
                 <td>${ele.department}</td>
                 <td>${ele.salary}</td>
                 <td>${ele.city}</td>
                 <td><button onclick="onEdit(this)" class="btn btn-sm btn-block btn-primary">Edit</button></td>
                 <td><button onclick="onRemove(this)" class="btn btn-sm btn-block btn-danger">Remove</button></td>
               </tr>`
             
 })
 empInfo.innerHTML = result;
}
showOnUi();

//edit
function onEdit(ele){
    let edit_id = ele.closest("tr").id;
    state.edit_id = edit_id;
    let edit_obj = state.empArr.find(obj => obj.id === edit_id);
    eNameControl.value = edit_obj.name;
    departmentControl.value = edit_obj.department;
    salaryControl.value = edit_obj.salary;
    cityControl.value = edit_obj.city;
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

//update
function onUdate(){
    let update_id = state.edit_id;
    let update_url = `${BASE_URL}/students/${update_id}.json`
    let update_Obj = {
        city: cityControl.value.trim(),
        department:departmentControl.value.trim(),
        name: eNameControl.value.trim(),
        salary: salaryControl.value ,
        id:update_id
    }
    toggleSpinner();
    fetch(update_url,{
        method:"PATCH",
        body:JSON.stringify(update_Obj),
        headers:{
          "content-type":"application/json",
          "authorization":"JWT TOKEN"  
        }
    })
     .then((res)=>{
        if(!res.ok){
            throw new Error("something went wrong")
        }
        return res.json();
    })
    .then((data)=>{
        cl(data);
        let getIndex = state.empArr.findIndex(obj=> obj.id === update_id);
        state.empArr[getIndex] = update_Obj;
        let tr = document.getElementById(update_id);
        tr.innerHTML = `<td></td>
                 <td>${update_Obj.name}</td>
                 <td>${update_Obj.department}</td>
                 <td>${update_Obj.salary}</td>
                 <td>${update_Obj.city}</td>
                 <td><button onclick="onEdit(this)" class="btn btn-sm btn-block btn-primary">Edit</button></td>
                 <td><button onclick="onRemove(this)" class="btn btn-sm btn-block btn-danger">Remove</button></td>`
                 submitBtn.classList.remove("d-none");
                 updateBtn.classList.add("d-none");
                 empForm.reset();
                 state.edit_id = null;
                 index()
                snackBar("Employee updated successfully", "success");
    })
    .catch((err)=>{
    snackBar(err.message,"error")
    })
    .finally(()=>{
        toggleSpinner()
    })
}

// delete
function onRemove(ele){
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let remove_id = ele.closest("tr").id;
    let remove_url = `${BASE_URL}/students/${remove_id}.json`
    toggleSpinner()
    fetch(remove_url,{
        method:"DELETE",
        body:null,
        headers:{
            "content-type":"application/json",
            "authorization":"JWT TOKEN"
        }
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error("something went wrong")
        }
        return res.json();
    })
    .then((data)=>{
        cl(data);
        let getIndex = state.empArr.findIndex(obj=> obj.id === remove_id);
        state.empArr.splice(getIndex,1);
        ele.closest("tr").remove();
        snackBar("employee deleted successfully!!","success")
        index()
    })
    .catch((err)=>{
    snackBar(err.message,"error")
    })
    .finally(()=>{
        toggleSpinner()
    })
  }
});
}
updateBtn.addEventListener("click",onUdate);
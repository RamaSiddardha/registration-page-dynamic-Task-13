var myForm = document.querySelector("#my-form");
myForm.addEventListener("submit", SubmitDetails);

var table = document.querySelector("table");

let maps = new Map();

table.addEventListener("click", removelist);
table.addEventListener("click", EditList);

// Edit Button Function

function EditList(e) {
  if (e.target.classList.contains("btn-edit")) {
    let rowIndex = e.target.parentElement.parentElement.rowIndex;
    let email = table.rows[rowIndex].cells[1].innerHTML;
    let Name = table.rows[rowIndex].cells[0].innerHTML;
    document.getElementById("email").value = email;
    document.getElementById("name").value = Name;

    axios.delete(
      "https://crudcrud.com/api/982a311973464aeea8854193c14da775/Registration/" +
        maps.get(email).id
    );
    maps.delete(email);
    var removeitem = e.target.parentElement.parentElement;
    table.removeChild(removeitem);
  }
}

// Delete Button Function

function removelist(e) {
  // table.rows[1].cells[1].innerHTML
  if (e.target.classList.contains("btn-delete")) {
    let rowIndex = e.target.parentElement.parentElement.rowIndex;
    let email = table.rows[rowIndex].cells[1].innerHTML;
    axios.delete(
      "https://crudcrud.com/api/982a311973464aeea8854193c14da775/Registration/" +
        maps.get(email).id
    );
    maps.delete(email);
    var removeitem = e.target.parentElement.parentElement;
    table.removeChild(removeitem);
  }
}

// Submit Details

function SubmitDetails(e) {
  e.preventDefault();
  let email = e.target.elements.email.value;
  let UserName = e.target.elements.name.value;
  if (maps.has(email) || email == "" || UserName == "") {
    alert(
      `Enter Vaid Details 
or Email Id already Exists`
    );
  } else {
    displayDetails(email, UserName);

    let Details = {
      Name: UserName,
      email: email,
    };

    axios
      .post(
        "https://crudcrud.com/api/982a311973464aeea8854193c14da775/Registration",
        Details
      )
      .then((res) => {
        maps.set(email, { id: res.data._id, Name: res.data.Name });
      })
      .catch((err) => {
        console.log(err);
      });

    document.getElementById("email").value = null;
    document.getElementById("name").value = null;
  }
}

// load data

function loadUsers() {
  axios
    .get(
      "https://crudcrud.com/api/982a311973464aeea8854193c14da775/Registration"
    )
    .then((res) => {
      let data = res.data;

      for (i of data) {
        maps.set(i.email, { id: i._id, Name: i.Name });
      }

      for (i of maps.keys()) {
        displayDetails(i, maps.get(i).Name);
      }
    });
}

loadUsers();

// Dispalay Details

function displayDetails(email, UserName) {
  let table = document.querySelector(".table");
  let row = document.createElement("tr");

  row.innerHTML = `
<td>${UserName}</td>
<td>${email}</td>
<td>
<button class="btn btn-danger btn-delete">Delete</button>
<button class="btn btn-danger btn-edit">Edit</button>
</td>
`;
  table.appendChild(row);
}

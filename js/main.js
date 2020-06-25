let vezes = 0;
function goTo(page) {
  window.location = page;s
}

function Register(name, email, phone, cep, password) {
  if (
    name == "" ||
    name == null ||
    email == "" ||
    email == null ||
    phone == "" ||
    phone == null ||
    cep == "" ||
    cep == null ||
    password == "" ||
    password == null
  ) {
    alert("Campos Vazios!");
  } else {
    let data = RegisterToJson(name, email, phone, cep, password);
    localStorage.setItem("User", data);
    Swal.fire({
      icon: "success",
      title: "Usuário com sucesso!",
      timer: 1500,
    });
    setTimeout(() => {
      goTo("index.html");
    }, 1500);
  }
}

function Login(email, password) {
  if (email == "" || email == null || password == "" || password == null) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Campos Vazios!",
      timer: 1500,
    });
  } else {
    let user = getUser();
    if (user.email == email && user.password == password) {
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Login efetuado!",
        timer: 1500,
      });
      setTimeout(() => {
        goTo("dashboard.html");
      }, 1500);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email ou senha incorretos!",
        timer: 1500,
      });
    }
  }
}

function RegisterToJson(name, email, phone, cep, password) {
  const data = {
    id: Date.now(),
    name: name,
    email: email,
    phone: phone,
    cep: cep,
    password: password,
    status: "active",
    categories: null,
    entries: null,
    balance: 0,
    exits: null,
  };
  return JSON.stringify(data);
}

function editUser() {
  let user = getUser();
  const { value: formValues } = Swal.fire({
    title:
      '<h2 style="color: black">Editar informações</h2>',
    html:
      "<label ; font-weight: bold;'>" +
      "NOME: " +
      "</label>" +
      '<input id="name" style="color: black;" type="text" placeholder="Nome"  value=' +
      user.name +
      '  style="color: white" class="swal2-input">' +
      "<label ; font-weight: bold;'>" +
      "EMAIL:" +
      "</label>" +
      '<input id="email" style="color: black;" type="email" placeholder="Email" value=' +
      user.email +
      '  style="color: white"  class="swal2-input">' +
      "<label ; font-weight: bold;'>" +
      "TELEFONE:" +
      "</label>" +
      '<input id="phone" style="color: black;" type="text" placeholder="Telefone" value=' +
      user.phone +
      ' style="color: white"  class="swal2-input">' +
      "<label ; font-weight: bold;'>" +
      "CEP:" +
      "</label>" +
      '<input id="cep" style="color: black;" type="text" placeholder="Cep" value=' +
      user.cep +
      ' style="color: white"  type="email" class="swal2-input">' +
      "<label ; font-weight: bold;'>" +
      "SENHA:" +
      "</label>" +
      '<input id="password" style="color: black;" type="password" placeholder="Senha" value=' +
      user.password +
      ' style="color: white" class="swal2-input">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      user.name = document.getElementById("name").value;
      user.email = document.getElementById("email").value;
      user.phone = document.getElementById("phone").value;
      user.cep = document.getElementById("cep").value;
      user.password = document.getElementById("password").value;
      localStorage.setItem("User", JSON.stringify(user));
      if (
        user.name == "" ||
        user.phone == "" ||
        user.cep == "" ||
        user.email == "" ||
        user.password == ""
      ) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Campos Vazios!",
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Alteração efetuada com sucesso!",
          timer: 1500,
        });
      }
    },
  });
}

function registerCategory() {
  let user = getUser();
  let categories = [];
  Swal.fire({
    title:
      '<h2 style="color: black; ;">Cadastre uma categoria</h2>',
    html:
      '<input id="categorie" type="text" style="color: black;" placeholder="Categoria" style="color: white" class="swal2-input">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      if (
        document.getElementById("categorie").value == "" ||
        document.getElementById("categorie").value == null
      ) {
        Swal.fire({
          icon: "warning",
          title: "Oops ...!",
          text: "Campos Vazios!",
          timer: 1500,
        });
      } else {
        categories = user.categories == null ? [] : user.categories;
        categories.push(document.getElementById("categorie").value);
        user.categories = categories;
        localStorage.setItem("User", JSON.stringify(user));
        Swal.fire({
          icon: "success",
          title: "Categoria salva!",
          timer: 1500,
        });
      }
    },
  });
}

function registerEntry() {
  getCategories(true);
}

function setEntry(user, indexCategorie, categories) {
  let entries = [];
  Swal.fire({
    title: '<h2 style="color: black;">Valor da entrada</h2>',
    html:
      '<input id="entry" type="number" style="color: black;"  placeholder="Entrada"  style="color: white" class="swal2-input">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      if (
        document.getElementById("entry").value == "" ||
        document.getElementById("entry").value == null
      ) {
        Swal.fire({
          icon: "warning",
          title: "Oops...!",
          text: "Campos Vazios!",
          timer: 1500,
        });
      } else if (/\D/.test(document.getElementById("entry").value)) {
        alert("Não coloque números no valor!");
      } else {
        entries = user.entries == null ? [] : user.entries;
        entries.push({
          id: Date.now(),
          category: categories[indexCategorie],
          value: document.getElementById("entry").value,
        });
        user.entries = entries;
        updateBalance(user, true);
        Swal.fire({
          icon: "success",
          title: "Entrada efetuada com sucesso!",
          timer: 1500,
        });        
    
      }
    },
  });
}

function getCategories(isEntry) {
  let user = getUser();
  if (user.categories == null) {
    Swal.fire({
      icon: "error",
      title: "Crie uma categoria!",
      timer: 1500,
    });
    registerCategory();
  } else {
    let categories = categoriesToJson(user.categories);
    Swal.fire({
      title: "Categorias",
      input: "select",
      inputOptions: categories,
      inputPlaceholder: "Categorias",
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value !== "") {
            resolve();
          } else {
            resolve("Você precisa selecionar uma categoria!");
          }
        });
      },
    }).then(function (result) {
      if (result.value) {
        isEntry
          ? setEntry(user, result.value, user.categories)
          : setExit(user, result.value, user.categories);
      }
    });
  }
}

function registerExit() {
  getCategories(false);
}

function setExit(user, indexCategorie, categories) {
  let exits = [];
  Swal.fire({
    title: '<h2 style="color: black;">Valor da saída</h2>',
    html:
      '<input id="exit" type="number" style="color: black;"  placeholder="Saída"  style="color: white" class="swal2-input">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      if (
        document.getElementById("exit").value == "" ||
        document.getElementById("exit").value == null
      ) {
        Swal.fire({
          icon: "warning",
          title: "Oops...!",
          text: "Campos Vazios!",
          timer: 1500,
        });
      } else if (/\D/.test(document.getElementById("exit").value)) {
        alert("Não coloque números no valor!");
      } else {
        exits = user.exits == null ? [] : user.exits;
        exits.push({
          id: Date.now(),
          category: categories[indexCategorie],
          value: document.getElementById("exit").value,
        });
        user.exits = exits;
        updateBalance(user, false);
        Swal.fire({
          icon: "success",
          title: "Saída efetuada com sucesso!",
          timer: 1500,
        });
       
      }
    },
  });
}

function updateBalance(user, isEntry) {

  if (isEntry) {
    //entrie = variavel vazia
    //entries = saldo
    //entry = entrada 
    //exit = saida

    let entrie = 0;
    user.entries.forEach((entry) => {
      entrie += parseFloat(entry.value);
    });

    user.balance = entrie;
    
  }   
  else{
    let exit = 0;
    user.exits.forEach((exits) => {
      exit += parseFloat(exits.value);
    });
    user.balance -= exit;
  }

  localStorage.setItem("User", JSON.stringify(user));
  getUserFinances();
}

function getUserFinances() {
  let user = getUser();
  let entries = 0;
  let exits = 0;
  let balance = user.balance;

  if (user.entries != null) {
    user.entries.forEach((entry) => {
      entries += parseFloat(entry.value);
    });
  }
  
  if (user.exits != null) {
    user.exits.forEach((exit) => {
      exits += parseFloat(exit.value);
    });
  }
  balance = entries - exits;
  document.getElementById("teste1").value = entries;
  document.getElementById("teste2").value = balance;
  document.getElementById("teste3").value = exits;

  document.getElementById("entriesQuant").innerHTML = entries;
  document.getElementById("balance").innerHTML = balance;
  document.getElementById("exitsQuant").innerHTML = exits;
}

function viewEntries() {
  let user = getUser();
  if (user.entries == null) {
    Swal.fire({
      icon: "warning",
      title: "Nenhuma entrada registrada!",
    });
    setTimeout(() => {
      goTo("dashboard.html");
    }, 1500);
  } else {
    user.entries.forEach((entrie) => {
      document.getElementById("entries").innerHTML +=
      "<div class='form-group col-3 col-lg-3'>"+
      "<div class='card'>"+
         " <div class='card-header texto'>"+
              "<h4>"+
              entrie.category +    " </h4>"+
          "</div>"+
          "<h3>"+
          "<span class='currency'>R$ </span>" +
          "<span class='count'>" +  entrie.value +   "</span>" +
          "</h3>"+
          "</div>"+
      "<div class='card-body numerosIndex'>"+
          "<i class='pe-7s-plus'></i>"+
     "</div></div></div>";
    
    });
}
}

function viewExits() {
  let user = getUser();
  if (user.exits == null) {
    Swal.fire({
      icon: "warning",
      title: "Nenhuma saída registrada!",
    });
    setTimeout(() => {
      goTo("dashboard.html");
    }, 1500);
  } else {
    user.exits.forEach((exit) => {
      document.getElementById("exits").innerHTML +=
      "<div class='form-group col-3 col-lg-3'>"+
      "<div class='card'>"+
         " <div class='card-header texto'>"+
              "<h4>"+
              exit.category +    " </h4>"+
          "</div>"+
          "<h3>"+
          "<span class='currency'>R$ </span>" +
          "<span class='count'>" + exit.value +   "</span>" +
          "</h3>"+
          "</div>"+
      "<div class='card-body numerosIndex'>"+
          "<i class='pe-7s-plus'></i>"+
     "</div></div></div>";

    });
}
}

function getUser() {
  const data = JSON.parse(localStorage.getItem("User"));
  return data;
}

function categoriesToJson(categories) {
  return Object.assign({}, categories);
}



class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == null || this[i] == "") {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem("id");
    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  proximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.proximoId();
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    let despesas = [];
    let id = localStorage.getItem("id");
    for (let i = 0; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));
      if (despesa === null) {
        continue;
      }
      despesa.id = i;
      despesas.push(despesa);
    }
    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = [];
    despesasFiltradas = this.recuperarTodosRegistros();
    if (despesa.ano != "") {
      despesasFiltradas = despesasFiltradas.filter(d => despesa.ano == d.ano);
      console.log(despesasFiltradas);
    }
    if (despesa.mes != "") {
      despesasFiltradas = despesasFiltradas.filter(d => despesa.mes == d.mes);
      console.log(despesasFiltradas);
    }
    if (despesa.dia != "") {
      despesasFiltradas = despesasFiltradas.filter(d => despesa.dia == d.dia);
      console.log(despesasFiltradas);
    }
    if (despesa.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter(d => despesa.tipo == d.tipo);
      console.log(despesasFiltradas);
    }
    if (despesa.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter(
        d => despesa.descricao == d.descricao
      );
      console.log(despesasFiltradas);
    }
    if (despesa.valor != "") {
      despesasFiltradas = despesasFiltradas.filter(
        d => despesa.valor == d.valor
      );
      console.log(despesasFiltradas);
    }

    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}
let bd = new Bd();

function cadastrarRegistro() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );
  if (despesa.validarDados()) {
    bd.gravar(despesa);
    document.getElementById("title_modal").innerHTML = "Dados Válidos";
    document.getElementById("title_modal").className =
      "modal-title text-success";
    document.getElementById("conteudo_modal").innerHTML =
      "Os dados foram cadastrados com sucesso";
    document.getElementById("btn_modal").innerHTML = "Ok";
    document.getElementById("btn_modal").className = "btn btn-success";

    ano.value = "";
    mes.value = "";
    dia.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";

    $("#modalRegistro").modal("show");
  } else {
    document.getElementById("title_modal").innerHTML = "Dados Inválidos";
    document.getElementById("title_modal").className =
      "modal-title text-danger";
    document.getElementById("conteudo_modal").innerHTML =
      "Os dados não foram cadas";
    document.getElementById("btn_modal").innerHTML = "Voltar e corrigir";
    document.getElementById("btn_modal").className = "btn btn-danger";
    $("#modalRegistro").modal("show");
  }
}

function carregarListaDespesa(despesas = [], filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros();
  }

  let lista = document.getElementById("listaDespesa");
  lista.innerHTML = "";

  despesas.forEach(d => {
    let linha = lista.insertRow();
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
    switch (parseInt(d.tipo)) {
      case 1:
        d.tipo = "Alimentação";
        break;
      case 2:
        d.tipo = "Educação";
        break;
      case 3:
        d.tipo = "lazer";
        break;
      case 4:
        d.tipo = "Saúde";
        break;
      case 5:
        d.tipo = "Tranporte";
        break;
    }
    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="far fa-trash-alt"></i>';
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function() {
      let id = this.id.replace("id_despesa_", "");
      bd.remover(id);
      window.location.reload();
    };
    linha.insertCell(4).append(btn);
  });
}

function PesquisarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let despesas = bd.pesquisar(despesa);
  carregarListaDespesa(despesas, true);
}

/* app.js — lógica principal */

// Modal
const Modal = {
  open(){
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close(){
    document.querySelector('.modal-overlay').classList.remove('active');
  }
};

// Storage
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transactions){
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
  }
};

// Transaction
const Transaction = {
  all: Storage.get(),

  add(transaction){
    Transaction.all.push(transaction);
    App.reload();
  },

  remove(index){
    Transaction.all.splice(index,1);
    App.reload();
  },

  incomes(){
    return Transaction.all
      .filter(t => t.amount > 0)
      .reduce((acc,t)=> acc + t.amount, 0);
  },

  expenses(){
    return Transaction.all
      .filter(t => t.amount < 0)
      .reduce((acc,t)=> acc + t.amount, 0);
  },

  total(){
    return Transaction.incomes() + Transaction.expenses();
  }
};

// DOM
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index){
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index){
    const CSSclass = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);
    const category = transaction.category ? `<td>${transaction.category}</td>` : `<td></td>`;

    const html = `
      <td class="description">${transaction.description}</td>
      ${category}
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./images/minus.svg" alt="Remover transação">
      </td>
    `;
    return html;
  },

  updateBalance(){
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransactions(){
    DOM.transactionsContainer.innerHTML = "";
  }
};

// Utils
const Utils = {
  // transforma string do input (ex: -1.234,56 ou -1234,56) em inteiro em centavos
  formatAmount(value){
    // aceita número com vírgula como decimal e pontos como milhar
    if (typeof value === 'number') return Math.round(value);
    let v = String(value).trim();

    // troca vírgula por ponto decimal
    v = v.replace(/\./g, "").replace(",", ".");
    // se tiver sinal + ou -
    const num = Number(v);
    if (isNaN(num)) throw new Error("Formato de valor inválido");
    return Math.round(num * 100);
  },

  // transforma yyyy-mm-dd -> dd/mm/yyyy
  formatDate(date){
    const splitted = date.split("-");
    return `${splitted[2]}/${splitted[1]}/${splitted[0]}`;
  },

  // recebe inteiro (centavos) e formata BRL
  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : "";
    const abs = Math.abs(Number(value));
    const formatted = (abs/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return signal + formatted;
  }
};

// Form
const Form = {
  description: document.querySelector('input#description'),
  category: document.querySelector('input#category'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return {
      description: Form.description.value,
      category: Form.category.value,
      amount: Form.amount.value,
      date: Form.date.value
    };
  },

  validateFields(){
    const { description, amount, date } = Form.getValues();
    if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
      throw new Error("Por favor, preencha descrição, valor e data.");
    }
  },

  formatValues(){
    let { description, category, amount, date } = Form.getValues();
    const formattedAmount = Utils.formatAmount(amount);
    const formattedDate = Utils.formatDate(date);

    return {
      description: description.trim(),
      category: category.trim(),
      amount: formattedAmount,
      date: formattedDate
    };
  },

  clearFields(){
    Form.description.value = "";
    Form.category.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event){
    event.preventDefault();
    try{
      Form.validateFields();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();
      Modal.close();
    } catch(error){
      alert(error.message);
    }
  }
};

// App
const App = {
  init(){
    Transaction.all.forEach(DOM.addTransaction);
    DOM.updateBalance();
    Storage.set(Transaction.all);
  },
  reload(){
    DOM.clearTransactions();
    App.init();
  }
};

App.init();
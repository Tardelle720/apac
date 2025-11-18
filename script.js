/* scripts.js — lógica principal */

/* Modal */
const Modal = {
  open(){
    document.querySelectorAll('.modal-overlay').forEach(el => el.classList.add('active'));
  },
  close(){
    document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('active'));
  }
};

/* Storage */
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transactions){
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
  }
};

/* Transaction */
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

/* DOM */
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index){
    if(!DOM.transactionsContainer) return;
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
        <img onclick="Transaction.remove(${index})" src="./images/minus.svg" alt="Remover transação" style="cursor:pointer">
      </td>
    `;
    return html;
  },

  updateBalance(){
    const elIncome = document.getElementById('incomeDisplay');
    const elExpense = document.getElementById('expenseDisplay');
    const elTotal = document.getElementById('totalDisplay');

    if(elIncome) elIncome.innerHTML = Utils.formatCurrency(Transaction.incomes());
    if(elExpense) elExpense.innerHTML = Utils.formatCurrency(Transaction.expenses());
    if(elTotal) elTotal.innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransactions(){
    if(DOM.transactionsContainer) DOM.transactionsContainer.innerHTML = "";
  }
};

/* Utils */
const Utils = {
  formatAmount(value){
    if (typeof value === 'number') return Math.round(value);
    let v = String(value).trim();
    v = v.replace(/\s/g, "");
    v = v.replace(/\./g, "").replace(",", ".");
    const num = Number(v);
    if (isNaN(num)) throw new Error("Formato de valor inválido");
    return Math.round(num * 100);
  },

  formatDate(date){
    const splitted = date.split("-");
    return `${splitted[2]}/${splitted[1]}/${splitted[0]}`;
  },

  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : "";
    const abs = Math.abs(Number(value));
    const formatted = (abs/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return signal + formatted;
  }
};

/* Form */
const Form = {
  description: null,
  category: null,
  amount: null,
  date: null,

  initFields(){
    Form.description = document.querySelector('input#description');
    Form.category = document.querySelector('select#category') || document.querySelector('input#category');
    Form.amount = document.querySelector('input#amount');
    Form.date = document.querySelector('input#date');
  },

  getValues(){
    return {
      description: Form.description ? Form.description.value : "",
      category: Form.category ? Form.category.value : "",
      amount: Form.amount ? Form.amount.value : "",
      date: Form.date ? Form.date.value : ""
    };
  },

  validateFields(){
    const { description, amount, date } = Form.getValues();
    if(description.trim() === "" || amount.toString().trim() === "" || date.trim() === ""){
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
    if(Form.description) Form.description.value = "";
    if(Form.category) Form.category.value = "";
    if(Form.amount) Form.amount.value = "";
    if(Form.date) Form.date.value = "";
  },

  submit(event){
    event.preventDefault();
    try{
      Form.initFields();
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

/* App */
const App = {
  init(){
    Transaction.all.forEach((t, i) => DOM.addTransaction(t, i));
    DOM.updateBalance();
    Storage.set(Transaction.all);
  },
  reload(){
    DOM.clearTransactions();
    App.init();
  }
};

App.init();

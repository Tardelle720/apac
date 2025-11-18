/* charts.js — inicializa gráficos */
document.addEventListener("DOMContentLoaded", () => {
  const transactions = JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];

  const incomes = transactions.filter(t => t.amount > 0).reduce((s,t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((s,t) => s + t.amount, 0);
  const total = incomes + expenses;

  const elIncome = document.getElementById("incomeHome") || document.getElementById("incomeDisplay");
  const elExpense = document.getElementById("expenseHome") || document.getElementById("expenseDisplay");
  const elTotal = document.getElementById("totalHome") || document.getElementById("totalDisplay");
  if(elIncome) elIncome.textContent = (incomes/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if(elExpense) elExpense.textContent = (expenses/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if(elTotal) elTotal.textContent = (total/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Chart Resumo (barras)
  const ctxResumo = document.getElementById("chartResumo");
  if(ctxResumo){
    new Chart(ctxResumo, {
      type: "bar",
      data: {
        labels: ["Receitas", "Despesas"],
        datasets: [{ label: "Valores (R$)", data: [incomes/100, Math.abs(expenses/100)] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // Chart Linha por data
  const byDate = {};
  transactions.forEach(t => {
    if(!byDate[t.date]) byDate[t.date] = 0;
    byDate[t.date] += t.amount;
  });

  const dates = Object.keys(byDate).sort((a,b) => {
    const pa = a.split("/").reverse().join("-");
    const pb = b.split("/").reverse().join("-");
    return new Date(pa) - new Date(pb);
  });
  const values = dates.map(d => (byDate[d]/100));

  const ctxLinha = document.getElementById("chartLinha");
  if(ctxLinha){
    new Chart(ctxLinha, {
      type: "line",
      data: {
        labels: dates,
        datasets: [{
          label: "Movimentação diária (R$)",
          data: values,
          borderWidth: 2,
          tension: 0.2
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // Relatórios por categoria e mês (se existirem canvases)
  const ctxCat = document.getElementById("chartCategoria");
  if(ctxCat){
    const porCat = {};
    transactions.forEach(t => {
      const c = (t.category || "Sem categoria");
      if(!porCat[c]) porCat[c] = 0;
      porCat[c] += t.amount;
    });

    new Chart(ctxCat, {
      type: 'pie',
      data: {
        labels: Object.keys(porCat),
        datasets: [{
          data: Object.values(porCat).map(v => v/100)
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  const ctxMes = document.getElementById("chartPorMes");
  if(ctxMes){
    const porMes = {};
    transactions.forEach(t => {
      const [dia, mes, ano] = t.date.split('/');
      const key = `${mes}/${ano}`;
      if(!porMes[key]) porMes[key] = 0;
      porMes[key] += t.amount;
    });

    new Chart(ctxMes, {
      type: 'line',
      data: {
        labels: Object.keys(porMes),
        datasets: [{
          label: 'Total mensal',
          data: Object.values(porMes).map(v => v/100),
          borderWidth: 2
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
});

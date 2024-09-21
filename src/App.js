import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [sales, setSales] = useState([]);
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [laoding, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/sales");
      setSales(res.data);
      setError(false);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/sales", { item, price, date });
    fetchSales();
    setItem("");
    setPrice("");
    setDate("");
  };

  const calcDailyTotal = () => {
    return sales.reduce((acc, sale) => acc + sale.price, 0);
  };

  const calcDailyNetProfit = () => {
    return calcDailyTotal() * 0.05;
  };

  const calcMonthlyTotal = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return sales
      .filter((sale) => new Date(sale.date) >= oneMonthAgo)
      .reduce((acc, sale) => acc + sale.price, 0);
  };

  const calcMonthlyNetProfit = () => {
    return calcMonthlyTotal() * 0.05;
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <h1>مدیریت فروش</h1>

      {/* Form to add new sales */}
      <form onSubmit={addSale} className="form__add">
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="عنوان"
          required
        />
        <input
          type="number"
          value={price.toLocaleString("fa-IR")}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="قیمت"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="تاریخ"
        />
        <button type="submit">ثبت</button>
      </form>

      {/* Sales Table */}
      {laoding ? (
        <div className="loader__container">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="error">
          مشکلی پیش آمده!!
          <button onClick={refreshPage}>تلاش مجدد</button>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>عنوان</th>
              <th>قیمت</th>
              <th>تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td>{sale.item}</td>
                <td>{sale.price.toLocaleString("fa-IR")}</td>
                <td>{new Date(sale.date).toLocaleDateString("fa")}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>جمع کل فروش (روزانه):</td>
              <td>{calcDailyTotal().toLocaleString("fa-IR")}</td>
            </tr>
            <tr>
              <td>سود خالص (5%):</td>
              <td>{calcDailyNetProfit().toLocaleString("fa-IR")}</td>
            </tr>
            <tr>
              <td>جمع کل (ماهیانه):</td>
              <td>{calcMonthlyTotal().toLocaleString("fa-IR")}</td>
            </tr>
            <tr>
              <td>سود خالص (ماه 5%):</td>
              <td>{calcMonthlyNetProfit().toLocaleString("fa-IR")}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

export default App;

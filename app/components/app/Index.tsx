import { useEffect, useState } from "react";
import Budget from "./budget";

interface HeaderProps {
  onAddTransactionClick: () => void;
}
interface Status{
  tr_type: string;
  total: number;
}
interface Budgets{
  amount: number;
}
const Header = ({ onAddTransactionClick }: HeaderProps) => {
  return (
    <>
      <div className="flex justify-between py-3">
       <h1 className=" text-slate-600">General Status</h1>
        <button className="bg-teal-500 py-1 px-6 text-white rounded-md mx-2" onClick={onAddTransactionClick}>
          <i className="bi bi-circle-arrow-up"></i> Set Budget
        </button>
      </div>
    </>
  );
};

const SalesDash = () => {
    const [status, setStatus] = useState<Status[]>([]);
    const [badget, setBadget] = useState<Budgets[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
   
    // Function to fetch nofication
    const fetchStatus = (url: string) => {
      setLoading(true);
      setError(null);
  
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch Transactions");
          }
          return response.json();
        })
        .then((data) => {
          setStatus(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };
  
    useEffect(() => {
      // Construct the API URL with search parameters
      const baseUrl = "/api/reports/cash-sum";
      // Fetch Transactions based on the URL search parameters
      fetchStatus(baseUrl);
    }, []); // Re-fetch when searchParams change
  
    useEffect(() => {
      // Fetch the orders
      fetch(`/api/budget`)
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Failed to fetch Orders");
              }
              return response.json();
          })
          .then((data) => {
             setBadget(data);
          })
          .catch((err) => {
             console.log(err.message)
          });
  }, []);
const cashInTotal = status
  .filter((st) => st.tr_type === "cash-in")
  .reduce((acc, st) => acc + Number(st.total || 0), 0);

const cashOutTotal = status
  .filter((st) => st.tr_type === "cash-out")
  .reduce((acc, st) => acc + Number(st.total || 0), 0);

const totalDifference = cashInTotal - cashOutTotal;

const overallTotal = cashInTotal + cashOutTotal;

const cashInPercentage = overallTotal > 0 ? ((cashInTotal / overallTotal) * 100).toFixed(0) : "0";
const cashOutPercentage = overallTotal > 0 ? ((cashOutTotal / overallTotal) * 100).toFixed(0) : "0";

  return (
      <>
      <div className="flex justify-between">

      <div className="bg-white border px-4 py-3 w-[250px] rounded-md mb-5">
          <div className="flex justify-between items-center text-slate-400 text-base pb-1">
              <h4 className="text-base font-medium text-slate-400">Total Cash In</h4>
              <i className="bi bi-cart-plus cart-plus text-xl mx-2 text-green-600 py-1 px-2 bg-green-50 rounded-full"></i>
          </div>
          <div className="text-xl font-bold text-slate-600 py-2">RWF{status.map((st)=>(st.tr_type == "cash-in" && st.total))}</div>
         <div className="flex items-center"> 
          <div className={`${cashInPercentage > cashOutPercentage ? 'bg-green-50 bg-opacity-80 text-green-500 ': ' bg-red-50 bg-opacity-80 text-red-500 '} font-semibold p-1 mr-3 rounded-md  w-max text-xs`}><i className={`bi ${cashInPercentage > cashOutPercentage ? 'bi-graph-up-arrow':'bi-graph-down-arrow'}  mr-[1px]`}></i> {cashInPercentage}%</div>
          <div className="font-normal text-base ml-2 text-slate-400">in the last week</div>
         </div>
      </div>
      <div className="bg-white border px-4 py-3 gap-4 w-[250px] rounded-md mb-5">
          <div className="flex justify-between items-center text-slate-400 text-base pb-1">
              <h4 className="text-base font-medium text-slate-400">Total Cash Out</h4>
              <i className="bi bi-three-dots cart-plus text-xl mx-2 text-green-600 py-1 px-2 bg-green-50 rounded-full"></i>
          </div>
          <div className="text-xl font-bold text-slate-600 py-2">RWF {status.map((st)=>(st.tr_type == "cash-out" && st.total))}</div>
         <div className="flex items-center"> 
         <div className={`${cashInPercentage < cashOutPercentage ? 'bg-green-50 bg-opacity-80 text-green-500 ': ' bg-red-50 bg-opacity-80 text-red-500 '} font-semibold p-1 mr-3 rounded-md  w-max text-xs`}><i className={`bi ${cashInPercentage < cashOutPercentage ? 'bi-graph-up-arrow':'bi-graph-down-arrow'}  mr-[1px]`}></i> {cashOutPercentage}%</div>
          <div className="font-normal text-base ml-2 text-slate-400">in the last week</div>
         </div>
      </div>
      <div className="bg-white border px-4 py-3 w-[250px] rounded-md mb-5">
          <div className="flex justify-between items-center text-slate-400 text-base pb-1">
              <h4 className="text-base font-medium text-slate-400">Budget</h4>
              <i className="bi bi-three-dots cart-plus text-xl mx-2 text-green-600 py-1 px-2 bg-green-50 rounded-full"></i>
          </div>
          <div className="text-xl font-bold text-slate-600 py-2">RWF{badget.map((m, index) => (index == 0 && m.amount))} </div>
         <div className="flex items-center"> 
          <div className="bg-green-50 bg-opacity-80 text-green-500 font-semibold p-1 mr-3 rounded-md  w-max text-xs"><i className="bi bi-circle mr-[1px]"></i></div>
          <div className="font-normal text-base ml-2 text-slate-400">in this month</div>
         </div>
      </div>
      <div className="bg-white border px-4 py-3 w-[250px] rounded-md mb-5">
          <div className="flex justify-between items-center text-slate-400 text-base pb-1">
              <h4 className="text-base font-medium text-slate-400">Total Revenue</h4>
              <i className="bi bi-people text-xl mx-2 text-green-600 py-1 px-2 bg-green-50 rounded-full"></i>
          </div>
          <div className="text-xl font-bold text-slate-600 py-2">RWF {totalDifference}</div>
         <div className="flex items-center"> 
          <div className="bg-red-50 bg-opacity-80 text-red-500 font-semibold p-1 mr-3 rounded-md  w-max text-xs"><i className="bi bi-graph-down-arrow mr-[1px]"></i> {(Number(cashInPercentage) - Number(cashOutPercentage)) /2 }%</div>
          <div className="font-normal text-base ml-2 text-slate-400">in the last week</div>
         </div>
      </div>
      </div>
      
      </>
  );
};



// Default export for Header
export default Header;

// Named export for SalesDash
export { SalesDash };

"use client";

import React, { useEffect, useState } from "react";

import { VictoryChart, VictoryLine, VictoryTooltip, VictoryTheme } from "victory";
import "leaflet/dist/leaflet.css";
import { SalesDash } from "../app/Index";
import Budget from "../app/budget";

interface Data {
  day: string;
  current: number;
  previous: number;
}

const SalesAnalytics = () => {
  const [cashInData, setCashInData] = useState<Data[]>([]);
  const [cashOutData, setCashOutData] = useState<Data[]>([]);
  const [status, setStatus] = useState({ loading: true, error: null as string | null });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [cashInResponse, cashOutResponse] = await Promise.all([
          fetch(`/api/reports/cash-in-report`),
          fetch(`/api/reports/cash-out-report`),
        ]);

        if (!cashInResponse.ok || !cashOutResponse.ok) {
          throw new Error("Failed to fetch transaction reports");
        }

        const [cashInData, cashOutData] = await Promise.all([
          cashInResponse.json(),
          cashOutResponse.json(),
        ]);

        setCashInData(cashInData);
        setCashOutData(cashOutData);
        setStatus({ loading: false, error: null });
      } catch (err: any) {
        setStatus({ loading: false, error: err.message });
      }
    };

    fetchReports();
  }, []);

  if (status.loading) {
    return <div className="text-center">Loading data...</div>;
  }

  if (status.error) {
    return <div className="text-center text-red-500">Error: {status.error}</div>;
  }
  return (
    <>
    <SalesDash />
    <div className="flex justify-between">
      {/* Sales Data Chart */}
      <div className="sales w-[45%] p-4 bg-white rounded-lg shadow-md m-3">
        <h1 className="text-xl font-medium text-gray-500 mb-2">Weekly Cash In</h1>
                     <div className='flex'>
                        <h3 className="text-xs text-gray-500 mb-1 mr-2">
                            <span className="mr-2 text-teal-500">●</span>
                            <span className="text-gray-800">Current Week</span>
                            <span className="ml-2"></span>
                        </h3>
                        <h3 className="text-xs text-gray-500">
                            <span className="mr-2 text-pink-500">●</span>
                            <span className="text-gray-800">Previous Week</span>
                            <span className="ml-2"></span>
                        </h3>
                    </div>
        <div className="chart">
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine
              data={cashInData}
              x="day"
              y="current"
              labelComponent={<VictoryTooltip />}
              style={{ data: { stroke: 'rgb(75, 192, 192)' } }}
            />
            <VictoryLine
              data={cashInData}
              x="day"
              y="previous"
              labelComponent={<VictoryTooltip />}
              style={{ data: { stroke: 'rgb(255, 99, 132)' } }}
            />
          </VictoryChart>
        </div>
      </div>

      <div className="sales w-[45%] p-4 bg-white rounded-lg shadow-md m-3">
        <h1 className="text-xl font-medium text-gray-500 mb-2">Weekly Cash Out</h1>
                     <div className='flex'>
                        <h3 className="text-xs text-gray-500 mb-2 mr-2">
                            <span className="mr-2 text-teal-500">●</span>
                            <span className="text-gray-800">Current Week</span>
                            <span className="ml-2"></span>
                        </h3>
                        <h3 className="text-xs text-gray-500">
                            <span className="mr-2 text-pink-500">●</span>
                            <span className="text-gray-800">Previous Week</span>
                            <span className="ml-2"></span>
                        </h3>
                    </div>
        <div className="chart">
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine
              data={cashOutData}
              x="day"
              y="current"
              labelComponent={<VictoryTooltip />}
              style={{ data: { stroke: 'rgb(75, 192, 192)' } }}
            />
            <VictoryLine
              data={cashOutData}
              x="day"
              y="previous"
              labelComponent={<VictoryTooltip />}
              style={{ data: { stroke: 'rgb(255, 99, 132)' } }}
            />
          </VictoryChart>
        </div>
      </div>
     </div>
     <Budget />
     </>
    );
};

export default SalesAnalytics;

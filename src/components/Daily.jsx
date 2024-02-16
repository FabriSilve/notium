/* eslint-disable react/prop-types */
import {
  TabPanel,
  LineChart,
  Card,
  Flex,
  AccordionList,
  Legend,
} from '@tremor/react';

import { TicketCard } from './TicketCard';
import { useContext, useMemo } from 'react';
import { Context } from '../logic/Context';

const demoDepedencyTickets = [
  { title: 'AaDev I see a new collection where the credentials are saved for each provider for each client', dependencies: [], id: 1 },
  { title: 'AaDev I can see a new api client for CreditSafe', dependencies: [1, 3], id: 2 },
  { title: 'AaDev I see a new collection where the creditSafe data is stored', dependencies: [2], id: 3 },
  { title: 'AaUser I can use a button to refresh the credit data of an entity when I want', dependencies: [3], id: 4 },
]

const demoTickets = [
  {
    properties: {
      Name: {
        title: [{
          plain_text: 'AaUser I can see demo data'
        }],
      },
      Status: {
        select: {
          name: 'Doing',
        }
      }
    },
  },
  {
    properties: {
      Name: {
        title: [{
          plain_text: 'AaUser I can see a blocked ticket'
        }],
      },
      Status: {
        select: {
          name: 'Blocked',
        }
      }
    },
  },
  {
    properties: {
      Name: {
        title: [{
          plain_text: '[Timebox 4h] AaDev I know how to use tremor components'
        }],
      },
      Status: {
        select: {
          name: 'Sprint Backlog',
        }
      }
    },
  },
  {
    properties: {
      Name: {
        title: [{
          plain_text: 'AaUser I find this demo very useful and think it has pretty colours'
        }],
      },
      Status: {
        select: {
          name: 'To Validate Developer',
        }
      }
    },
  },
  {
    properties: {
      Name: {
        title: [{
          plain_text: 'AaDev I know this ticket section is displaying demo tickets'
        }],
      },
      Status: {
        select: {
          name: 'Review',
        }
      }
    },
  },
  {
    properties: {
      Name: {
        title: [{
          plain_text: 'AaDev I know this ticket is displayed here'
        }],
      },
      Status: {
        select: {
          name: 'Review',
        }
      }
    },
  },
];

const demoChartdata = [
  {
    day: 'Monday',
    Ideal: 152,
    Actual: 152,
  },
  {
    day: 'Friday',
    Ideal: 137,
    Actual: 137,
  },
  {
    day: 'Thursday',
    Ideal: 120,
    Actual: 122,
  },
  {
    day: 'Wednesday',
    Ideal: 104,
    Actual: 102,
  },
  {
    day: 'Tuesday',
    Ideal: 88,
    Actual: 87,
  },
  {
    day: 'Monday',
    Ideal: 72,
    Actual: 72,
  },
  {
    day: 'Friday',
    Ideal: 56,
    Actual: 60,
  },
  {
    day: 'Thursday',
    Ideal: 40,
    Actual: 23,
  },
  {
    day: 'Wednesday',
    Ideal: 24,
    Actual: 22,
  },
  {
    day: 'Tuesday',
    Ideal: 16,
    Actual: 16,
  },
];

const valueFormatter = function (number) {
  return number + ' points ';
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function BurndownChart() {
  const { rawTickets, useDemo } = useContext(Context);

  const doneTicketsByDate = useMemo(() => {
    if (useDemo) return { pointsPerDay: demoChartdata, totalDonePoints: 152 };

    const doneTickets =  rawTickets.filter(rawTicket => rawTicket?.properties.Status.select.name === "Done #13");
    const totalDonePoints = doneTickets.reduce((totalSum, doneTicket) => totalSum + doneTicket?.properties["Complexity Points"].number, 0);

    const pointsPerDayRaw = doneTickets.reduce((acc, doneTicket) => {
      const points = doneTicket?.properties["Complexity Points"].number || 0;
      const date = doneTicket?.last_edited_time;

      if (date) {
        const dateString = formatDate(new Date(date));

        if (acc[dateString]) acc[dateString] += points;
        else acc[dateString] = points;
      }
      return acc;
    }, {});

    const pointsPerDayArray = Object.keys(pointsPerDayRaw).map((key) => ({
      day: key,
      points: pointsPerDayRaw[key],
    })).sort((a, b) => {
      if (a.day < b.day) return -1;
      if (a.day > b.day) return 1;
      return 0;
  });
    
    const totalPoints = 96;
    const LENGTH_OF_SPRINT = 10;
    const pointsPerDay = [];

    let totalPointsDone = 0; 
  
    for (let i = 0; i < pointsPerDayArray.length; i += 1) {
      totalPointsDone += pointsPerDayArray[i].points;
      pointsPerDay.push({
        day: pointsPerDayArray[i].day,
        Ideal: totalPoints - (totalPoints/LENGTH_OF_SPRINT * i),
        Actual: totalPoints - totalPointsDone,
      }) 
    }
    return { pointsPerDay, totalDonePoints };
  }, [rawTickets, useDemo]);

  return (
    <>
      <LineChart
        className="mt-6 h-60"
        data={doneTicketsByDate.pointsPerDay}
        index="day"
        yAxisWidth={65}
        categories={['Ideal', 'Actual']}
        colors={['red', 'blue']}
        valueFormatter={valueFormatter}
      />
    </>
  );
}

const Ticket = ({ title, status }) => {
  let color = "black";

  if(status === "Sprint Backlog") color = "violet";
  if(status === "Doing") color = "orange";
  if(status === "Blocked") color = "red";
  if(status === "Review") color = "cyan";
  if(status === "To Validate Developer") color = "yellow";

  return (
    <Card className={`p-4 m-2 w-80 border-solid border-2 border-${color}-300`}>
      <h3>{title}</h3>
    </Card>
  );
};

function TicketSection() {
  const { rawTickets, useDemo } = useContext(Context);

  const allTickets = useMemo(() => {
    if(useDemo) return demoTickets;
  
    const sprintTickets =  rawTickets.filter(rawTicket => 
      rawTicket?.properties.Status.select.name === "Sprint Backlog"
      || rawTicket?.properties.Status.select.name === "Doing"
      || rawTicket?.properties.Status.select.name === "Blocked"
      || rawTicket?.properties.Status.select.name === "Review"
      || rawTicket?.properties.Status.select.name === "To Validate Developer"
    );

    return sprintTickets;
  }, [rawTickets, useDemo]);

  return (
    <Flex className="flex-wrap" >
      {allTickets.map((ticket, index) => (
        <Ticket key={index} title={ticket.properties.Name.title[0].plain_text} status={ticket.properties.Status.select.name}/>
      ))}
    </Flex>
  )
}

const Daily = () => {
  return (
    <TabPanel>
      <Flex
        className="w-full"
        flexDirection="col"
      >
        <Card style={{ marginBottom: '30px' }}>
          <BurndownChart />
        </Card>
        <Card style={{ marginBottom: '30px' }}>
          <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Tickets</h3>
          <Legend style={{ marginBottom: '30px' }} categories={["Sprint Backlog", "Doing", "Blocked", "Review", "To Validate Developer"]} colors={["violet", "orange", "red", "cyan", "yellow"]}/>
          <TicketSection/>
        </Card>
        <Card style={{ marginBottom: '30px' }}>
          <h3 className="m-3 text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Dependency tickets</h3>
          <AccordionList >{demoDepedencyTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} allTickets={demoDepedencyTickets} />)}</AccordionList>
          {/* {demoDepedencyTickets.map((ticket) => )} */}
        </Card>
      </Flex>
    </TabPanel>
  );
};

export default Daily;

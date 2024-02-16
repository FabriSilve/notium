import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
  LineChart,
  Card,
  BarList,
  Flex,
  AccordionList,
} from '@tremor/react';

import { TicketCard } from './TicketCard';

const timeSpentOn = [
  { name: 'Features', value: 456 },
  { name: 'Bug fixes', value: 351 },
  { name: 'Unplanned', value: 51 },
];

const mockTickets = [
  { title: 'AaUser I can see this in Notium', dependencies: [2], id: 1 },
  { title: 'AaUser I can see dependencies', dependencies: [], id: 2 },
  { title: 'AaUser I can see dependencies2', dependencies: [2, 4, 1], id: 3 },
  { title: 'AaUser I can see dependencies3', dependencies: [3], id: 4 },
]

const chartdata = [
  {
    day: 'Tuesday',
    Ideal: 16,
    Actual: 16,
  },
  {
    day: 'Wednesday',
    Ideal: 24,
    Actual: 22,
  },
  {
    day: 'Thursday',
    Ideal: 40,
    Actual: 23,
  },
  {
    day: 'Friday',
    Ideal: 56,
    Actual: 60,
  },
  {
    day: 'Monday',
    Ideal: 72,
    Actual: 72,
  },
  {
    day: 'Tuesday',
    Ideal: 88,
    Actual: 87,
  },
  {
    day: 'Wednesday',
    Ideal: 104,
    Actual: 102,
  },
  {
    day: 'Thursday',
    Ideal: 120,
    Actual: 122,
  },
  {
    day: 'Friday',
    Ideal: 137,
    Actual: 137,
  },
  {
    day: 'Monday',
    Ideal: 152,
    Actual: 152,
  },
];

const valueFormatter = function (number) {
  return number + ' points ';
};

export function BurndownChart() {
  return (
    <>
      <LineChart
        className="mt-6 h-60"
        data={chartdata}
        index="day"
        yAxisWidth={65}
        categories={['Ideal', 'Actual']}
        colors={['red', 'cyan']}
        valueFormatter={valueFormatter}
      />
    </>
  );
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
        <Card>
          <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Dependency tickets</h3>
          <AccordionList>{mockTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} allTickets={mockTickets} />)}</AccordionList>
          {/* {mockTickets.map((ticket) => )} */}
        </Card>
      </Flex>
      <Flex
        className="w-full"
        flexDirection="col"
      >
        <Card>
          <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Time spent on</h3>
          <BarList data={timeSpentOn} className="mx-auto max-w-sm" />
        </Card>
      </Flex>
    </TabPanel>
  );
};

export default Daily;

import {
  TabPanel,
  Card,
  Flex,
  Bold,
  Text,
  BarList,
  AccordionList,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
  Divider,
  DonutChart,
  Legend,
} from '@tremor/react';
import {
  useContext,
  useState,
  useMemo,
} from 'react';
import { Context } from '../logic/Context';

const epicsDemo = [{
  name: "Factoring",
  value: 34,
  color: 'green',
}, {
  name: "Loss Reservation",
  value: 28,
  color: 'blue',
}, {
  name: "Debt Collection",
  value: 16,
  color: 'yellow',
}, {
  name: "21Grams",
  value: 11,
  color: 'purple',
}, {
  name: "Partner API",
  value: 8,
  color: 'gray',
}, {
  name: "KBAR",
  value: 6,
  color: 'red',
}];

function getRandomColor() {
  const colors = [
    'gray',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

const Epics = () => {
  const {
    hasData,
    useDemo,
    rawTickets
  } = useContext(Context);

  const [data, setData] = useState(epicsDemo);
  const [isComputing, setIsComputing] = useState(true);
  const [seeMore, setSeeMore] = useState(false);

  useMemo(() => {
    if (useDemo) setData(epicsDemo);
    else {
      const doneTickets = rawTickets.filter(ticket => /^Done/.test(ticket.properties.Status.select.name));
      const epicData = doneTickets.reduce((acc, ticket) => {
        const epic = ticket.properties.EpicName.formula.string || 'KBAR';
        const points = (ticket.properties.Points || ticket.properties['Complexity Points']).number || 0;

        if (!acc[epic]) acc[epic] = points;
        else acc[epic] += points;

        return acc;
      }, {});
      const data = Object.keys(epicData).map(epic => ({
        name: epic,
        value: epicData[epic],
        color: getRandomColor(),
      })).sort((a, b) => b.value - a.value);
      setData(data);
    }
    setIsComputing(false);
  }, [rawTickets, useDemo, setData, setIsComputing]);

  if (!hasData) return <p>no data</p>;
  if (isComputing) return <p>computing...</p>;

  return (
    <>
      <Flex>
        <Text>
          <Bold>Topics</Bold>
        </Text>
        <Text>
          <Bold>Points</Bold>
        </Text>
      </Flex>
      <BarList data={seeMore ? data : data.slice(0, 5)} />
      <Flex
        className='w-full'
        alignItems='end'
        justifyContent='end'
      >
        <Button className="mt-1" variant="light" onClick={() => setSeeMore(!seeMore)}>{ !seeMore ? 'See More...' : 'See Less'}</Button>
      </Flex>
    </>
  )
}

const epicStatsDemo = [{
  "name": "GDPR flow fix",
  "points": 17,
  "feature": 8,
  "investigation": 9,
  "startedAt": "2024-01-31",
  "lastUpdated": "2024-01-31",
  "ticketNumber": 3,
  "conttributors": [
    "Pandi Çunoti"
  ]
}, {
  "name": "Update Bank ID Apis",
  "points": 12,
  "feature": 12,
  "investigation": 0,
  "startedAt": "2024-02-14",
  "lastUpdated": "2024-02-14",
  "ticketNumber": 1,
  "conttributors": [
    "Fabrizio Silvestri"
  ]
}];

const EpicStats = () => {
  const {
    hasData,
    useDemo,
    rawTickets
  } = useContext(Context);

  const [data, setData] = useState();
  const [isComputing, setIsComputing] = useState(true);

  useMemo(() => {
    if (useDemo) setData(epicStatsDemo);
    else {
      const doneTickets = rawTickets.filter(ticket => /^Done/.test(ticket.properties.Status.select.name));

      const epicData = doneTickets.reduce((acc, ticket) => {
        const epic = ticket.properties.EpicName.formula.string || 'KBAR';
        const points = (ticket.properties.Points || ticket.properties['Complexity Points']).number || 0;
        const lastUpdated = ticket.last_edited_time.slice(0, 10);
        const isInvestigation = /^\[/.test(ticket.properties.Name.title[0].plain_text);
        const conttributors = (ticket.properties.Assign.people || []).map(person => person.name);

        if (!acc[epic]) {
          acc[epic] = {
            points,
            feature: isInvestigation ? 0 : points,
            investigation: isInvestigation ? points : 0,
            startedAt: lastUpdated,
            lastUpdated,
            ticketNumber: 1,
            conttributors: conttributors,
          };
        } else {
          acc[epic].points += points;
          acc[epic].feature += (isInvestigation ? 0 : points);
          acc[epic].investigation += (isInvestigation ? points : 0);
          acc[epic].ticketNumber += 1;
          if (lastUpdated < acc[epic].startedAt) acc[epic].startedAt = lastUpdated;
          if (lastUpdated > acc[epic].lastUpdated) acc[epic].lastUpdated = lastUpdated;
          acc[epic].conttributors = Array.from(new Set([...acc[epic].conttributors, ...conttributors]));
        }

        return acc;
      }, {});
      const data = Object.keys(epicData).map(epic => ({
        name: epic,
        ...epicData[epic],
      })).sort((a, b) => b.points - a.points);
      setData(data);
    }
    setIsComputing(false);
  }, [rawTickets, useDemo, setData, setIsComputing]);

  if (!hasData) return <p>no data</p>;
  if (isComputing) return <p>computing...</p>;
  return (
    <AccordionList>
      {data.map((epic) => (
        <Accordion key={epic.name}>
          <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            <Flex
              alignItems='space-between'
            >
              <Text>{epic.name}</Text>
              <Text>Started: {epic.startedAt}</Text>
            </Flex>
          </AccordionHeader>
          <AccordionBody className="leading-6">
            <Flex className='items-stretch p-4'>
              <Flex
                flexDirection="col"
                alignItems="center"
                justifyContent="around"
                className="h-full"
              >
                <Legend
                  categories={["Investigation", "Feature"]}
                  colors={["orange", "green"]}
                />
                <DonutChart
                  data={[{
                    name: "Investigation",
                    points: epic.investigation,
                  }, {
                    name: "Feature",
                    points: epic.feature,
                  }]}
                  category="points"
                  index="name"
                  valueFormatter={(number) => `${Intl.NumberFormat("se").format(number).toString()} pt.`}
                  colors={["orange", "green"]}
                />
              </Flex>
              <Flex
                className='h-100'
                flexDirection='col'
                justifyContent='between'
                alignItems='end'
              >
                  <Text><Bold>Last Updated:</Bold> {epic.lastUpdated}</Text>
                  <Flex flexDirection='col' alignItems='end'>
                    <Bold>Contributors:</Bold>
                    {epic.conttributors.map((contributor) => <Text key={contributor}>{contributor}</Text>)}
                  </Flex>
              </Flex>
            </Flex>
          </AccordionBody>
        </Accordion>
      ))}
    </AccordionList>
  )
}

const Resources = () => {

  return (
    <TabPanel>
      <Card className="col-span-2">
        <Epics />
        <Divider />
        <EpicStats />
      </Card>
    </TabPanel>
  )
};

export default Resources;

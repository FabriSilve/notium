import {
  Button,
  Dialog,
  DialogPanel,
  TextInput,
} from '@tremor/react';
import {
  useState,
  useCallback,
  useContext,
} from 'react';
import Cookies from 'js-cookie';
import { Context } from '../logic/Context';

const URL = "https://bbmtaxqvndfucwmecqlmu5a6bm0axqes.lambda-url.eu-central-1.on.aws";

function SettingModal() {
  const storedToken = Cookies.get('token');
  const storedDatabase = Cookies.get('database');
  const storedStart = Cookies.get('start');

  const {
    setTickets,
    hasData,
    setHasData,
    setUseDemo,
  } = useContext(Context);

  const [isOpen, setIsOpen] = useState(!hasData);
  const [isLoading, setIsLoading] = useState(false);

  const [token, setToken] = useState(storedToken || '');
  const [database, setDatabase] = useState(storedDatabase || '');
  const [start, setStart] = useState(storedStart || '');

  const saveSettings = useCallback(async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setUseDemo(false);
    Cookies.set('token', token, { expires: 30 });
    Cookies.set('database', database, { expires: 30 });
    Cookies.set('start', start, { expires: 30 });

    const baseParams = `notion_key=${token}&database_id=${database}${start ? `&last_edited_time=${start}` : ''}`;
    let data = await fetch(`${URL}?page_size=100&${baseParams}`);
    let result = await data.json();
    let tickets = result.pages.results;
    let nextCursor = result.pages.next_cursor
    while (nextCursor) {
      data = await fetch(`${URL}?page_size=100&cursor=${nextCursor}&${baseParams}`);
      result = await data.json();
      tickets = tickets.concat(result.pages.results);
      nextCursor = result.pages.next_cursor
    }

    setTickets(tickets);
    setHasData(true);
    setIsOpen(false)
    setIsLoading(false);
  }, [
    start,
    token,
    database,
    setTickets,
    setHasData,
    setUseDemo,
  ]);

  const seeDemo = useCallback(async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setHasData(true);
    setUseDemo(true);

    setIsOpen(false)
    setIsLoading(false);
  }, [
    setHasData,
    setUseDemo,
  ]);

  return (
    <>
      <Button
        className="mx-auto block fixed top-4 right-20 z-20"
        onClick={() => setIsOpen(true)}
      >
        Settings
      </Button>
      <Dialog open={isOpen} onClose={(val) => !isLoading & hasData ? setIsOpen(val) : null} static={true}>
        <DialogPanel>
          <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Settings</h3>
          <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            Populate the required fields to give access to the data.
          </p>
          <TextInput
            className="mt-6"
            placeholder="Notion Key"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
          <TextInput
            className="mt-6"
            placeholder="Database ID"
            type="password"
            value={database}
            onChange={(event) => setDatabase(event.target.value)}
          />
          <TextInput
            className="mt-6"
            placeholder="Start Date (YYYY-MM-DD)"
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
          <Button
            className="mt-8 w-full"
            onClick={saveSettings}
            disabled={isLoading}
          >
            Fetch Data
          </Button>
          <Button
            className="mt-8 w-full"
            onClick={seeDemo}
            disabled={isLoading}
          >
           See Demo
          </Button>
        </DialogPanel>
      </Dialog>
    </>
  );
}

export default SettingModal;
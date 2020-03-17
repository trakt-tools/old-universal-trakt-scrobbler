import { CircularProgress } from '@material-ui/core';
import * as React from 'React';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UtsCenter } from '../../../components/UtsCenter';
import { BrowserStorage } from '../../../services/BrowserStorage';
import { Session } from '../../../services/Session';
import { PopupNotWatching } from '../components/PopupNotWatching';
import { PopupWatching } from '../components/PopupWatching';
import { ScrobbleItem } from '../../../models/ScrobbleItem';

interface IPopupHomeContent {
  isLoading: boolean,
  currentItem: ScrobbleItem,
}

const initialContentState: IPopupHomeContent = {
  isLoading: true,
  currentItem: null,
};

const HomePage: React.FC = () => {
  const history = useHistory();
  const [content, setContent] = useState(initialContentState);

  useEffect(() => {
    async function getCurrentItem(): Promise<void> {
      if (Session.isLoggedIn) {
        const values = await BrowserStorage.get('currentItem');
        setContent({
          isLoading: false,
          currentItem: values.currentItem || null,
        });
      } else {
        setContent({ ...initialContentState });
        history.push('/login');
      }
    }

    getCurrentItem();
  }, []);

  let component = null;
  if (content.isLoading) {
    component = (
      <UtsCenter>
        <CircularProgress color="secondary"/>
      </UtsCenter>
    );
  } else if (content.currentItem) {
    component = (
      <PopupWatching item={content.currentItem}/>
    );
  } else {
    component = (
      <PopupNotWatching/>
    );
  }
  return component;
}

export { HomePage };
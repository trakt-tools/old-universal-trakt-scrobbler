import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UtsCenter } from '../../../components/UtsCenter';
import { BrowserStorage } from '../../../services/BrowserStorage';
import { Session } from '../../../services/Session';
import { PopupNotWatching } from '../components/PopupNotWatching';
import { PopupWatching } from '../components/PopupWatching';

const initialContentState = {
  isLoading: true,
  currentItem: null,
};

function HomePage() {
  const history = useHistory();
  const [content, setContent] = useState(initialContentState);

  useEffect(() => {
    /**
     * @returns {Promise}
     */
    async function getCurrentItem() {
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
import React, { useState } from 'react';
import { stripHtml } from './helpers';
import Modal from './Modal';

interface Show {
  id: number;
  name: string;
  image?: { medium: string; original: string };
  summary?: string;
}

interface ShowDetails extends Show {
  // include whatever extra fields may be returned (any allows access dynamically)
  [key: string]: any;
}

interface Props {
  show: Show;
  onSelect: (show: Show) => void;
}

const ShowItem: React.FC<Props> = ({ show, onSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState<ShowDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const openModal = async () => {
    setModalOpen(true);
    onSelect(show);
    if (!details) {
      setLoading(true);
      try {
        const res = await fetch(`https://api.tvmaze.com/shows/${show.id}`);
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error('fetch details failed', err);
      }
      setLoading(false);
    }
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <li className="show-item" onClick={openModal}>
        {show.image && <img src={show.image.medium} alt={show.name} />}
        <div className="show-content">
          <h2>{show.name}</h2>
          {show.summary && <p>{stripHtml(show.summary)}</p>}
        </div>
      </li>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {loading && <p>Loading details…</p>}
        {details && (
          <div className="show-details">
            <h2>{details.name}</h2>
            <p><strong>Type:</strong> {details.type}</p>
            <p><strong>Language:</strong> {details.language}</p>
            <p><strong>Genres:</strong> {details.genres?.join(', ')}</p>
            <p><strong>Status:</strong> {details.status}</p>
            <p><strong>Premiered:</strong> {details.premiered}</p>
            <p><strong>Official site:</strong> <a href={details.officialSite} target="_blank" rel="noopener noreferrer">{details.officialSite}</a></p>
            {details.summary && <div dangerouslySetInnerHTML={{ __html: details.summary }} />}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ShowItem;

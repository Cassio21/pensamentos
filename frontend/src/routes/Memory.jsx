import axios from '../axios-config';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import './Memory.css';

const Memory = () => {
  const { id } = useParams();

  const [memory, setMemory] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const getMemory = async () => {
      const res = await axios.get(`/memories/${id}`);

      setMemory(res.data);

      setComments(res.data.comments);
    };
    getMemory();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const comment = { name, text };

      const res = await axios.patch(
        `/memories/${memory._id}/comment/`,
        comment
      );

      console.log('Resposta:', res); // Verifique o que está sendo retornado

      if (!res || !res.data) {
        throw new Error('Resposta inválida');
      }

      const lastComment = res.data?.comment?.pop();

      setComments((comments) => [...comments, lastComment]);
      setName('');
      setText('');

      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
      console.log('Erro:', error);
      toast.error(error.response.data.err);
    }
  };

  if (!memory) return <p>Carregando...</p>;

  return (
    <div className="memory-page">
      <img src={`${axios.defaults.baseURL}${memory.src}`} alt={memory.title} />
      <h2>{memory.title}</h2>
      <p>{memory.description}</p>
      <div className="comment-form">
        <h3>Envie seu comentário:</h3>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="Nome"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>

          <label>
            <textarea
              placeholder="Comentários"
              onChange={(e) => setText(e.target.value)}
              value={text}
            ></textarea>
          </label>
          <input type="submit" value="Enviar" className="btn" />
        </form>
      </div>
      <div className="comments-container">
        <h3>Comentários ({comments.length})</h3>
        {comments.length === 0 && <p>Não há comentários...</p>}
        {comments.length > 0 &&
          comments.map((comment) => (
            <div className="comment" key={comment._id}>
              <p className="comment-name"> {comment.name}</p>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Memory;

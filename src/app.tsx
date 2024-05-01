import { ChangeEvent, useState } from 'react';
import logo from './assets/logo.svg';
import { AddNote } from './components/add-note/add-note';
import { NoteCard } from './components/note-card/note-card'


interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {

  const [search, setSearch] = useState('');

  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');

    if (notesOnStorage)
      return JSON.parse(notesOnStorage);
    else
      return []
  })

  //preciso criar uma função para passar por paramentro para o elementro filho e ele alterar o pai, essa funcao vai criar um objto novo e add na lista ja existente. 

  function onNoteCreated(content: string) {
    //criando um novo objeto na estrutura que preciso
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    //criando uma nova nota, passando a new note antes, depois passando para o array antigo
    const notesArray = [newNote, ...notes];
    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  //funcao para pegar o valor do input ao digitar
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  function onNoteDelete(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })
    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));

  }

  const filteredNotes = search !== ''
    ? notes.filter(notes => notes.content.toLowerCase().includes(search.toLowerCase()))
    : notes

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt="" />

      <form action="" className='w-full'>
        <input
          type="text"
          placeholder='Busque suas notas...'
          className='w-full bg-transparent text-3xl font-semibold placeholder:text-slate-500 outline-none'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-500'></div>


      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] '>
        <AddNote onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} date={note.date} content={note.content} onNoteDelete={onNoteDelete} id={note.id}/>
        })

        }
      </div>
    </div>
  )
}



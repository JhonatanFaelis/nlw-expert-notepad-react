import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner';

//estou criando uma interface falando o que é necessario ter no meu app como prop
interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
    //essa funcao que estou recebendo do elemento pai vai ser usada no handleSaveNote para criar a nota nova recebendo o content como parametro
}

export function AddNote({ onNoteCreated }: NewNoteCardProps) {

    let speechRecognition: SpeechRecognition | null;
    // primeiro passo é criar a variavel, trazendo para ela em forma de Array, o elemento em si e depois a funcao para trocar o valor do elemento e atribui ao useState(usando o valor inicial que deseja)
    const [shouldShowOnBoard, setShouldShowOnBoard] = useState(true);
    const [content, setContent] = useState("");
    const [isRecording, setIsRecording] = useState(false)

    function handleStartEditor() {
        setShouldShowOnBoard(false)
    }

    function hadleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.value == '' ? setShouldShowOnBoard(true) : setShouldShowOnBoard(false);
        setContent(event.target.value);
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault();


        if (content.trim() == "")
            return


        onNoteCreated(content);
        //apos criar a nota, limpar o conteudo 
        setShouldShowOnBoard(true);
        setContent('');
        //apos limpar chamamos a funcao do should
        toast.success("Nota criada com sucesso!");
    }


    function handleStartRecording() {
        setIsRecording(true)
        setShouldShowOnBoard(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI();

        speechRecognition.lang = 'pt-BR';
        //continua, só para de gravar quando pedir
        speechRecognition.continuous = true;
        //traz a palavra mais proxima ao que falou
        speechRecognition.maxAlternatives = 1;
        //vai digitando conforme vai falando, nao espera chegar ao final
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')
            setContent(transcription);
        }

        speechRecognition.start();
    }

    function handleStopRecording() {
        speechRecognition?.stop();


        setIsRecording(false);
    }


    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-700 p-4 gap-2 overflow-hidden'>
                <span>Adicionar nota</span>
                <p className='font-medium text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
            </Dialog.Trigger>

            <Dialog.Portal>
                {/* o overlay serve para fazer a parte escura que da a sensação de ter outra coisa por cima */}
                <Dialog.Overlay className='inset-0 bg-black/60 fixed' />

                <Dialog.Content onClick={handleStartEditor} className='fixed left-1/2 overflow-hidden top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] h-[60vh] w-full bg-slate-700 rounded-md flex flex-col p-4 outline-none'>
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 rounded-sm hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>
                    <form className='flex flex-1 flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span>Adicionar nota</span>
                            {shouldShowOnBoard ? (
                                <p className='font-medium text-slate-400'>
                                    Comece <button onClick={handleStartRecording} type='button' className='text-lime-400'>gravando uma nota</button> em áudio ou se preferir <button onClick={handleStartEditor} type='button' className='text-lime-400'>utilize apenas texto</button>.
                                </p>
                            ) : (
                                <textarea
                                    onChange={hadleContentChange}
                                    autoFocus
                                    className='text-sm bg-transparent text-slate-400 resize-none flex-1 outline-none'
                                    value={content}
                                >

                                </textarea>
                            )}

                        </div>
                        {isRecording ? (
                            <button
                                type='button'
                                className='w-full flex items-center gap-2 justify-center bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none hover:text-slate-100'
                                onClick={handleStopRecording}
                            >
                                <div className='size-3 rounded-full bg-red-600 animate-pulse' />
                                Gravando! (clique para interromper)
                            </button>
                        ) : (
                            <button
                                type='button'
                                className='w-full bg-lime-500 py-4 text-center text-sm text-slate-100 outline-none hover:bg-lime-600'
                                onClick={handleSaveNote}
                            >
                                Salvar nota?
                            </button>
                        )}

                    </form>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>

    )
}
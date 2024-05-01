import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'


interface NoteCardProps {
    id : string,
    date: Date,
    content: string,
    onNoteDelete : (id :string) => void
}


export function NoteCard(props: NoteCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-700 p-4 gap-2 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
                <span>{formatDistanceToNow(props.date, {locale:ptBR, addSuffix : true})}</span>
                <p className='font-medium text-slate-400'>
                    {props.content}
                </p>

                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'></div>
            </Dialog.Trigger>
            {/* estrutura para fazer o modal aparecer, o portal transporta o modal para o body */}
            <Dialog.Portal>
                {/* o overlay serve para fazer a parte escura que da a sensação de ter outra coisa por cima */}
                <Dialog.Overlay className='inset-0 bg-black/60 fixed' />

                <Dialog.Content className='fixed left-1/2 overflow-hidden top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] h-[60vh] w-full bg-slate-700 rounded-md flex flex-col p-4 outline-none'>
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 rounded-sm hover:text-slate-100'>
                        <X className='size-5'/>
                    </Dialog.Close>
                    <div className='flex flex-1 flex-col gap-3 p-5'>
                        <span>{formatDistanceToNow(props.date, { locale: ptBR, addSuffix: true })}</span>
                        <p className='font-medium text-slate-400'>
                            {props.content}
                        </p>

                    </div>
                    <button
                        type='button'
                        className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none group'
                        onClick={() => props.onNoteDelete(props.id)}
                    >
                        Deseja <span className='text-red-600 group-hover:underline'>apagar esta nota</span>?
                    </button>
                </Dialog.Content>
            </Dialog.Portal>

        </Dialog.Root>

    )
}
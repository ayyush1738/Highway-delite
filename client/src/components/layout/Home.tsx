import container from '../../assets/container.png';
import Forms from './Forms';

export default function Home() {
    return (
        <div className="flex flex-row h-full">
            <div className="w-[40%]">
                <section className="p-4">
                    <img src="/logo.png" alt="" />
                </section>
                <Forms />
            </div>
            <div className='w-[60%]'>
                <img src={container} className="h-full w-full" alt="" />
            </div>
        </div>
    )
}  
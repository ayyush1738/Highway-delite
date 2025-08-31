import container from '../../assets/container.png';
import Forms from './Forms';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side: Logo + Form */}
      <div className="w-full md:w-[40%] flex flex-col h-screen">
        <section className="p-4 flex-shrink-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-14 md:w-auto mt-4 md:mt-1 mx-auto md:mx-0"
          />
        </section>

        {/* Form takes remaining space */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full w-full md:p-4 box-border">
            <Forms />
          </div>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="w-full md:w-[60%] hidden md:flex h-screen rounded-2xl overflow-hidden">
        <img
          src={container}
          className="w-full "
          alt="Illustration"
        />
      </div>
    </div>
  );
}

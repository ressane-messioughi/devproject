import form from '/icon/form.png';
import discord from '/icon/discord.png';
import help from '/icon/help.png';
import OptionButton from '../ui/OptionButton.jsx';

function LoginComponentRight() {
  return (
    <section className="flex flex-col items-center justify-center h-full gap-10 w-full max-w-sm">
      <OptionButton to="/register" icon={form} label="Créer un compte" />
      <OptionButton icon={discord} label=" Discord" />
      <OptionButton icon={help} label="Besoin d'aide ?" />
    </section>
  );
}

export default LoginComponentRight;

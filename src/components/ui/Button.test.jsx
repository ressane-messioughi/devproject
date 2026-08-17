import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button.jsx';

describe('Button', () => {
  it("declenche l'action au clic", async () => {
    const action = vi.fn(); // fausse fonction, retient les appels
    const user = userEvent.setup(); // faux utilisateur

    render(<Button onClick={action}>Valider</Button>);

    await user.click(screen.getByText('Valider'));

    expect(action).toHaveBeenCalled();
  });
});

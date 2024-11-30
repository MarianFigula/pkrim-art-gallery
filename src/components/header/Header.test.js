import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import CartSite from '../../sites/cartSite/CartSite.js';
import { LoginSite } from '../../sites/loginSite/LoginSite.js';
import { MainSite } from '../../sites/mainSite/MainSite.js';
import '@testing-library/jest-dom';

test('navigates to CartSite when bi bi-cart is clicked', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Header />} />
                <Route path="/cart" element={<CartSite />} />
            </Routes>
        </MemoryRouter>
    );

    const cartLink = screen.getByRole('link', { name: /cart/i });


    fireEvent.click(cartLink);

    expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
});

test('open sidebar when click on sidebar icon', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Header />} />
            </Routes>
        </MemoryRouter>
    );

    const sidebarLink = screen.getByRole('link', { name: /sidebar/i });


    fireEvent.click(sidebarLink);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('navigates to SignIn when bi bi-person is clicked', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Header />} />
                <Route path="/login" element={<LoginSite />} />
            </Routes>
        </MemoryRouter>
    );

    const signInLink = screen.getByRole('link', { name: /SignIn/i });
    fireEvent.click(signInLink);

    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    expect(signInButton).toBeInTheDocument();

    const signInHeader = screen.getByRole('heading', { name: /Sign In/i });
    expect(signInHeader).toBeInTheDocument();
});

test('navigates to MainSite when the link is clicked', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                {/* Render both Header and MainSite at the root path */}
                <Route path="/" element={<><Header /><MainSite /></>} />
            </Routes>
        </MemoryRouter>
    );

    const link = screen.getByLabelText(/MainSite/i);

    fireEvent.click(link);
    expect(screen.getByText(/Discover new Arts/i)).toBeInTheDocument();
});
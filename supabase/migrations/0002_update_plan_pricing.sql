-- Atualiza o preço anual do Premium para refletir a oferta exibida na página inicial.
update public.plans
set price = 179.90
where slug = 'anual';

// cspell: disable
import 'package:flutter/material.dart';

// Widget customizado para a barra superior do app
class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key});

  // O método build constrói a interface do AppBar
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white, // Cor de fundo branca
      elevation: 1, // Sombra leve abaixo da barra
      title: Text(
        'ShopApp', // Título central da barra
        style: TextStyle(
          color: Colors.black, // Cor do texto
          fontWeight: FontWeight.bold, // Texto em negrito
          fontSize: 24, // Tamanho da fonte
        ),
      ),
      actions: [
        // Botão de notificações à direita
        IconButton(
          icon: Icon(Icons.notifications_outlined, color: Colors.black),
          onPressed: () {}, // Ação ao clicar (vazia por enquanto)
        ),
        // Botão de sacola/carrinho à direita
        IconButton(
          icon: Icon(Icons.shopping_bag_outlined, color: Colors.black),
          onPressed: () {}, // Ação ao clicar (vazia por enquanto)
        ),
      ],
    );
  }

  // Define a altura padrão do AppBar (obrigatório para PreferredSizeWidget)
  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
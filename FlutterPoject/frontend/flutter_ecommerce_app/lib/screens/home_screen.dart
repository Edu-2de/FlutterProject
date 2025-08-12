// cspell: disable
import 'package:flutter/material.dart';
// Importa widgets customizados criados em outros arquivos
import '../widgets/custom_app_bar.dart';
import '../widgets/banner_carousel.dart';
import '../widgets/category_list.dart';
import '../widgets/featured_products.dart';

// Tela principal do app, sem estado interno (StatelessWidget)

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Scaffold fornece a estrutura visual básica (app bar, body, bottom bar)
    return Scaffold(
      appBar: CustomAppBar(), // Barra superior customizada
      body: SingleChildScrollView(
        // Permite rolar a tela caso o conteúdo seja maior que a altura da tela
        child: Column(
          children: [
            BannerCarousel(),      // Carrossel de banners promocionais
            SizedBox(height: 20), // Espaçamento vertical
            CategoryList(),       // Lista horizontal de categorias
            SizedBox(height: 20), // Espaçamento vertical
            FeaturedProducts(),   // Lista horizontal de produtos em destaque
          ],
        ),
      ),
      
      // Barra de navegação inferior com 4 ícones
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed, // Ícones fixos
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),         // Tela inicial
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),     // Busca
          BottomNavigationBarItem(icon: Icon(Icons.shopping_cart), label: 'Cart'),// Carrinho
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),    // Perfil
        ],
      ),
    );
  }
}
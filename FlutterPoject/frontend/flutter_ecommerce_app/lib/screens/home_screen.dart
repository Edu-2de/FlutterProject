// cspell: disable
import 'package:flutter/material.dart';
// Importa widgets customizados criados em outros arquivos
import '../widgets/custom_app_bar.dart';
import '../widgets/banner_carousel.dart';
import '../widgets/category_list.dart';
import '../widgets/featured_products.dart';

// Tela principal de conteúdo da Home
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
    );
  }
}

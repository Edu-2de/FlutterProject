// cspell: disable
import 'package:flutter/material.dart';

// Widget que exibe um carrossel de banners promocionais
class BannerCarousel extends StatefulWidget {
  // Construtor padrão, permite uso de chave para identificação do widget na árvore
  const BannerCarousel({super.key});

  // Cria o estado associado a este widget
  @override
  State<BannerCarousel> createState() => _BannerCarouselState();
}

// Classe de estado do BannerCarousel, onde fica a lógica e o layout
class _BannerCarouselState extends State<BannerCarousel> {
  // Lista de URLs das imagens dos banners (dados fictícios)
  final List<String> banners = [
    'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Summer+Sale',
    'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=New+Arrivals',
    'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Special+Offer',
  ];

  // Método obrigatório que constrói a interface do widget
  @override
  Widget build(BuildContext context) {
    // SizedBox define a altura fixa do carrossel
    return SizedBox(
      height: 200,
      // PageView.builder cria um carrossel rolável horizontalmente
      child: PageView.builder(
        itemCount: banners.length, // Quantidade de banners a exibir
        itemBuilder: (context, index) {
          // Cada página do carrossel é um Container estilizado
          return Container(
            margin: EdgeInsets.symmetric(horizontal: 16), // Espaço nas laterais do banner
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12), // Bordas arredondadas
              image: DecorationImage(
                image: NetworkImage(banners[index]), // Carrega imagem da internet
                fit: BoxFit.cover, // Imagem cobre todo o espaço do container
              ),
            ),
          );
        },
      ),
    );
  }
}
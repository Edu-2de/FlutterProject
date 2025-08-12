// cspell: disable
import 'package:flutter/material.dart';

// Widget que exibe uma lista horizontal de produtos em destaque
class FeaturedProducts extends StatelessWidget {
  // Lista de produtos fictícios, cada produto é um Map com nome, imagem e preço
  final List<Map<String, dynamic>> products = [
    {
      'name': 'Wireless Headphones',
      'image': 'https://via.placeholder.com/150/2196F3/FFFFFF?text=Headphones',
      'price': 149.99
    },
    {
      'name': 'Cotton T-Shirt',
      'image': 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=T-Shirt',
      'price': 24.99
    },
    {
      'name': 'Garden Tool Set',
      'image': 'https://via.placeholder.com/150/FFC107/FFFFFF?text=Garden+Set',
      'price': 89.99
    },
    {
      'name': 'Running Shoes',
      'image': 'https://via.placeholder.com/150/F44336/FFFFFF?text=Shoes',
      'price': 129.99
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start, // Alinha à esquerda
      children: [
        // Título "Featured Products" com padding lateral
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Featured Products',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SizedBox(height: 12), // Espaço entre o título e a lista
        Container(
          height: 220, // Altura fixa para a lista de produtos
          child: ListView.builder(
            scrollDirection: Axis.horizontal, // Lista rola na horizontal
            itemCount: products.length, // Quantidade de produtos
            itemBuilder: (context, index) {
              final product = products[index]; // Produto atual
              return Container(
                width: 160, // Largura de cada card de produto
                margin: EdgeInsets.symmetric(horizontal: 8), // Espaço entre os cards
                child: Card(
                  elevation: 2, // Sombra do card
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12), // Bordas arredondadas
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Imagem do produto com borda arredondada no topo
                      ClipRRect(
                        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                        child: Image.network(
                          product['image'],
                          height: 120,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      // Nome do produto com padding interno
                      Padding(
                        padding: EdgeInsets.all(8),
                        child: Text(
                          product['name'],
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis, // Trunca se for muito longo
                        ),
                      ),
                      // Preço do produto com padding lateral
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: Text(
                          '\$${product['price'].toStringAsFixed(2)}',
                          style: TextStyle(
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                      ),
                      Spacer(), // Empurra o botão para o final do card
                      // Botão "Add to Cart" com padding e largura total
                      Padding(
                        padding: EdgeInsets.all(8),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () {}, // Ação ao clicar (vazia por enquanto)
                            child: Text('Add to Cart'),
                            style: ElevatedButton.styleFrom(
                              padding: EdgeInsets.symmetric(vertical: 8),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
// cspell: disable
import 'package:flutter/material.dart';

// Widget que exibe uma lista horizontal de categorias
class CategoryList extends StatelessWidget {
  // Lista de categorias, cada uma é um Map com nome (String) e ícone (IconData)
  // O tipo Map<String, dynamic> indica que a chave é sempre String,
  // e o valor pode ser qualquer tipo (String, IconData, etc)
  final List<Map<String, dynamic>> categories = [
    {'name': 'Electronics', 'icon': Icons.phone_android},
    {'name': 'Fashion', 'icon': Icons.checkroom},
    {'name': 'Home', 'icon': Icons.home},
    {'name': 'Sports', 'icon': Icons.sports_basketball},
  ];

  CategoryList({super.key});

  // Como StatelessWidget, a lista não muda durante a execução do app

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start, // Alinha à esquerda
      children: [
        // Título "Categories" com padding lateral
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Categories',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SizedBox(height: 12), // Espaço entre o título e a lista
        SizedBox(
          height: 100, // Altura fixa para a lista de categorias
          child: ListView.builder(
            scrollDirection: Axis.horizontal, // Lista rola na horizontal
            itemCount: categories.length, // Quantidade de categorias
            itemBuilder: (context, index) {
              // Cada item da lista é um Container com ícone e nome
              return Container(
                width: 80,
                margin: EdgeInsets.symmetric(horizontal: 8), // Espaço entre os itens
                child: Column(
                  children: [
                    // Ícone circular da categoria
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: Colors.blue.shade100,
                      child: Icon(
                        categories[index]['icon'], // Ícone da categoria
                        color: Colors.blue,
                        size: 28,
                      ),
                    ),
                    SizedBox(height: 8), // Espaço entre ícone e texto
                    // Nome da categoria centralizado
                    Text(
                      categories[index]['name'],
                      style: TextStyle(fontSize: 12),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
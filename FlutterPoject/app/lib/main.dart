import 'package:flutter/material.dart';
import 'widgets/search_bar.dart';
import 'widgets/horizontal_buttons.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.start, // Alinha à esquerda
          children: [
            // Barra de pesquisa no topo
            SearchBarWidget(
              onChanged: (query) {
                // Aqui você pode filtrar sua lista de produtos, por exemplo
                print('Search query: $query');
              },
            ),
            // Lista horizontal de botões logo abaixo da barra de pesquisa
            const HorizontalButtonList(),
            // O resto do seu conteúdo aqui
            const Expanded(
              child: Center(child: Text('Product list goes here')),
            ),
          ],
        ),
      ),
    );
  }
}
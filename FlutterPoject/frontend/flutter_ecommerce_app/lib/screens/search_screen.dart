// cspell: disable
import 'package:flutter/material.dart';
import '../widgets/custom_app_bar.dart';

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  final List<Map<String, dynamic>> products = const [
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
    return Scaffold(
      appBar: CustomAppBar(),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            SearchBar(
              hintText: 'Search products...',
              onChanged: (value) {
                // Aqui você pode implementar a lógica de filtro
              },
            ),
            const SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: products.length,
                itemBuilder: (context, index) {
                  final product = products[index];
                  return ListTile(
                    leading: Image.network(product['image']),
                    title: Text(product['name']),
                    subtitle: Text("\$${product['price']}"),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

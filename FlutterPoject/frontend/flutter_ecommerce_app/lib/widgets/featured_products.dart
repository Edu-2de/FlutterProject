import 'package:flutter/material.dart';

class FeaturedProducts extends StatelessWidget {
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
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
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
        SizedBox(height: 12),
        Container(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];
              return Container(
                width: 160,
                margin: EdgeInsets.symmetric(horizontal: 8),
                child: Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                        child: Image.network(
                          product['image'],
                          height: 120,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.all(8),
                        child: Text(
                          product['name'],
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
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
                      Spacer(),
                      Padding(
                        padding: EdgeInsets.all(8),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () {},
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
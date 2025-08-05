// ignore_for_file: avoid_print

import 'package:flutter/material.dart';
import 'widgets/search_bar.dart';
import 'widgets/horizontal_buttons.dart';
import 'widgets/banner_carousel.dart';

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
          crossAxisAlignment: CrossAxisAlignment.start, 
          children: [
     
            SearchBarWidget(
              onChanged: (query) {
                
                print('Search query: $query');
              },
            ),
         
            const HorizontalButtonList(),

            const BannerCarousel(),
           
            const Expanded(
              child: Center(child: Text('Product list goes here')),
            ),
          ],
        ),
      ),
    );
  }
}
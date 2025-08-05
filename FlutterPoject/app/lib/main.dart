import 'package:flutter/material.dart';
import 'widgets/header.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: const Header(),
        body: const Center(
          child: Text('Content'),
        ),
      ),
    );
  }
}
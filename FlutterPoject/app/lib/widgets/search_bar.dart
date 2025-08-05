import 'package:flutter/material.dart';

class SearchBarWidget extends StatelessWidget {
  final ValueChanged<String> onChanged;

  const SearchBarWidget({super.key, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20.0, 40.0, 10.0, 5.0),
      child: TextField(
        decoration: InputDecoration(
          hintText: 'Search products...', 
          prefixIcon: const Icon(Icons.search), 
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8.0), 
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.grey[200],
        ),
        onChanged: onChanged, 
      ),
    );
  }
}
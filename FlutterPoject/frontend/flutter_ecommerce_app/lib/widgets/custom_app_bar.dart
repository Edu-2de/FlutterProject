// filepath: c:\Projects\FlutterProject\FlutterPoject\frontend\flutter_ecommerce_app\lib\widgets\custom_app_bar.dart
import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 1,
      title: Text(
        'ShopApp',
        style: TextStyle(
          color: Colors.black,
          fontWeight: FontWeight.bold,
          fontSize: 24,
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(Icons.notifications_outlined, color: Colors.black),
          onPressed: () {},
        ),
        IconButton(
          icon: Icon(Icons.shopping_bag_outlined, color: Colors.black),
          onPressed: () {},
        ),
      ],
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
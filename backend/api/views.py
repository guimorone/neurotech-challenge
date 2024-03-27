from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class API(APIView):
    def get(self, request: Request) -> Response:
        return Response("Hello, world!", status=status.HTTP_200_OK)
